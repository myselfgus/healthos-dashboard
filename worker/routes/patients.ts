import { Hono } from 'hono';
import { Env } from '../core-utils';

const patients = new Hono<{ Bindings: Env }>();

// List patients with pagination
patients.get('/', async (c) => {
  const { limit = '10', cursor } = c.req.query();

  try {
    // Mock data for development (replace with KV when available)
    const mockPatients = [
      {
        id: 'pt-001',
        name: 'João Silva',
        status: 'ATIVO',
        age: 45,
        lastVisit: '2025-11-20',
        createdAt: '2025-01-15',
      },
      {
        id: 'pt-002',
        name: 'Maria Santos',
        status: 'EM OBS',
        age: 32,
        lastVisit: '2025-11-19',
        createdAt: '2025-02-10',
      },
      {
        id: 'pt-003',
        name: 'Pedro Costa',
        status: 'INATIVO',
        age: 67,
        lastVisit: '2025-10-15',
        createdAt: '2024-12-01',
      },
    ];

    if (c.env.PATIENT_DATA) {
      const result = await c.env.PATIENT_DATA.list({
        prefix: 'patient:',
        limit: parseInt(limit),
        cursor,
      });

      const patients = await Promise.all(
        result.keys.map(async (key) => {
          const data = await c.env.PATIENT_DATA!.get(key.name, 'json');
          return data;
        })
      );

      return c.json({
        success: true,
        data: patients,
        cursor: result.list_complete ? null : result.cursor,
      });
    }

    // Return mock data if KV is not configured
    return c.json({
      success: true,
      data: mockPatients.slice(0, parseInt(limit)),
      cursor: null,
    });
  } catch (error: any) {
    console.error('[PATIENTS] List error:', error);
    return c.json({
      success: false,
      error: 'Failed to list patients',
    }, 500);
  }
});

// Get single patient
patients.get('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    if (c.env.PATIENT_DATA) {
      const patient = await c.env.PATIENT_DATA.get(`patient:${id}`, 'json');

      if (!patient) {
        return c.json({
          success: false,
          error: 'Patient not found',
        }, 404);
      }

      return c.json({ success: true, data: patient });
    }

    // Mock data
    const mockPatient = {
      id,
      name: 'João Silva',
      status: 'ATIVO',
      age: 45,
      lastVisit: '2025-11-20',
      createdAt: '2025-01-15',
    };

    return c.json({ success: true, data: mockPatient });
  } catch (error: any) {
    console.error('[PATIENTS] Get error:', error);
    return c.json({
      success: false,
      error: 'Failed to get patient',
    }, 500);
  }
});

// Create patient
patients.post('/', async (c) => {
  try {
    const data = await c.req.json<any>();
    const id = crypto.randomUUID();

    const patient = {
      id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (c.env.PATIENT_DATA) {
      await c.env.PATIENT_DATA.put(
        `patient:${id}`,
        JSON.stringify(patient),
        {
          metadata: { status: data.status },
        }
      );
    }

    // Track in analytics
    if (c.env.ANALYTICS) {
      c.env.ANALYTICS.writeDataPoint({
        blobs: ['patient_created'],
        doubles: [1],
        indexes: [id],
      });
    }

    return c.json({ success: true, data: patient }, 201);
  } catch (error: any) {
    console.error('[PATIENTS] Create error:', error);
    return c.json({
      success: false,
      error: 'Failed to create patient',
    }, 500);
  }
});

// Update patient
patients.put('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const updates = await c.req.json<any>();

    if (c.env.PATIENT_DATA) {
      const existing = await c.env.PATIENT_DATA.get(`patient:${id}`, 'json');

      if (!existing) {
        return c.json({
          success: false,
          error: 'Patient not found',
        }, 404);
      }

      const patient = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await c.env.PATIENT_DATA.put(
        `patient:${id}`,
        JSON.stringify(patient),
        {
          metadata: { status: patient.status },
        }
      );

      return c.json({ success: true, data: patient });
    }

    return c.json({
      success: true,
      data: { id, ...updates },
    });
  } catch (error: any) {
    console.error('[PATIENTS] Update error:', error);
    return c.json({
      success: false,
      error: 'Failed to update patient',
    }, 500);
  }
});

// Delete patient
patients.delete('/:id', async (c) => {
  const id = c.req.param('id');

  try {
    if (c.env.PATIENT_DATA) {
      await c.env.PATIENT_DATA.delete(`patient:${id}`);
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('[PATIENTS] Delete error:', error);
    return c.json({
      success: false,
      error: 'Failed to delete patient',
    }, 500);
  }
});

// Search patients
patients.get('/search/:term', async (c) => {
  const term = c.req.param('term').toLowerCase();

  try {
    // Mock search
    const mockPatients = [
      {
        id: 'pt-001',
        name: 'João Silva',
        status: 'ATIVO',
      },
    ];

    const results = mockPatients.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.id.toLowerCase().includes(term)
    );

    return c.json({
      success: true,
      data: results,
      query: term,
    });
  } catch (error: any) {
    console.error('[PATIENTS] Search error:', error);
    return c.json({
      success: false,
      error: 'Search failed',
    }, 500);
  }
});

export default patients;
