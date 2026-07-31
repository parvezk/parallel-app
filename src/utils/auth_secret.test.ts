
jest.mock('@heroui/react', () => ({}));
jest.mock('@/db/db', () => ({
  db: {
    query: {
      users: {
        findFirst: jest.fn()
      }
    },
    insert: jest.fn()
  }
}));

jest.mock('@/db/schema', () => ({
  users: {}
}));

jest.mock('@/db/db', () => ({
  db: {
    query: {
      users: {
        findFirst: jest.fn()
      }
    },
    insert: jest.fn()
  }
}));

jest.mock('@/db/schema', () => ({
  users: {}
}));

describe('auth JWT secret handling', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should not throw error in non-production when JWT_SECRET is not set', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.JWT_SECRET;
    expect(() => {
      // Create a fresh module loader environment to avoid babel transform issues in jest
      jest.isolateModules(() => {
        require('./auth.ts');
      });
    }).not.toThrow();
  });

  it('should throw error in production when JWT_SECRET is not set', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.JWT_SECRET;
    expect(() => {
      jest.isolateModules(() => {
        require('./auth.ts');
      });
    }).toThrow('JWT_SECRET environment variable is not set in production');
  });

  it('should not throw error in production when JWT_SECRET is set', () => {
    process.env.NODE_ENV = 'production';
    process.env.JWT_SECRET = 'my_secret';
    expect(() => {
      jest.isolateModules(() => {
        require('./auth.ts');
      });
    }).not.toThrow();
  });
});
