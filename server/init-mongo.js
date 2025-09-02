// MongoDB initialization script
db = db.getSiblingDB('anu-frequency');

// Create user for the application
db.createUser({
  user: 'anu-frequency-user',
  pwd: 'anu-frequency-password',
  roles: [
    {
      role: 'readWrite',
      db: 'anu-frequency'
    }
  ]
});

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 2,
          maxLength: 50
        },
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        },
        password: {
          bsonType: 'string',
          minLength: 6
        }
      }
    }
  }
});

db.createCollection('presets', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'userId', 'frequencies'],
      properties: {
        name: {
          bsonType: 'string',
          minLength: 1,
          maxLength: 100
        },
        userId: {
          bsonType: 'objectId'
        },
        frequencies: {
          bsonType: 'array',
          minItems: 1,
          maxItems: 5
        }
      }
    }
  }
});

db.createCollection('sessions', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['userId', 'sessionData', 'startTime'],
      properties: {
        userId: {
          bsonType: 'objectId'
        },
        startTime: {
          bsonType: 'date'
        },
        endTime: {
          bsonType: 'date'
        }
      }
    }
  }
});

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.presets.createIndex({ userId: 1, category: 1 });
db.presets.createIndex({ isPublic: 1, category: 1 });
db.presets.createIndex({ name: 'text', description: 'text' });
db.sessions.createIndex({ userId: 1, startTime: -1 });
db.sessions.createIndex({ presetId: 1 });
db.sessions.createIndex({ isCompleted: 1 });

print('Database initialized successfully');