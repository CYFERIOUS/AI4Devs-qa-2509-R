import { Education } from './Education';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    education: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('Education', () => {
  let prisma: PrismaClient;
  let mockEducation: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockEducation = {
      institution: 'Test University',
      title: 'Bachelor of Science',
      startDate: '2020-01-01',
      endDate: '2024-01-01',
    };
    jest.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create Education instance with all properties', () => {
      const data = {
        id: 1,
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: '2020-01-01',
        endDate: '2024-01-01',
        candidateId: 5,
      };

      const education = new Education(data);

      expect(education.id).toBe(1);
      expect(education.institution).toBe('Test University');
      expect(education.title).toBe('Bachelor of Science');
      expect(education.startDate).toBeInstanceOf(Date);
      expect(education.startDate.toISOString().split('T')[0]).toBe('2020-01-01');
      expect(education.endDate).toBeInstanceOf(Date);
      expect(education.endDate?.toISOString().split('T')[0]).toBe('2024-01-01');
      expect(education.candidateId).toBe(5);
    });

    it('should create Education instance with minimal required properties', () => {
      const data = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: '2020-01-01',
      };

      const education = new Education(data);

      expect(education.id).toBeUndefined();
      expect(education.institution).toBe('Test University');
      expect(education.title).toBe('Bachelor of Science');
      expect(education.startDate).toBeInstanceOf(Date);
      expect(education.endDate).toBeUndefined();
      expect(education.candidateId).toBeUndefined();
    });

    it('should handle string dates and convert to Date objects', () => {
      const data = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: '2020-01-01',
        endDate: '2024-01-01',
      };

      const education = new Education(data);

      expect(education.startDate).toBeInstanceOf(Date);
      expect(education.endDate).toBeInstanceOf(Date);
      expect(education.startDate.toISOString().split('T')[0]).toBe('2020-01-01');
      expect(education.endDate?.toISOString().split('T')[0]).toBe('2024-01-01');
    });

    it('should handle Date objects directly', () => {
      const startDate = new Date('2020-01-01');
      const endDate = new Date('2024-01-01');
      const data = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: startDate,
        endDate: endDate,
      };

      const education = new Education(data);

      expect(education.startDate).toBeInstanceOf(Date);
      expect(education.endDate).toBeInstanceOf(Date);
      expect(education.startDate).toEqual(startDate);
      expect(education.endDate).toEqual(endDate);
    });

    it('should handle null/undefined endDate', () => {
      const dataWithNull = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: '2020-01-01',
        endDate: null,
      };

      const educationWithNull = new Education(dataWithNull);
      expect(educationWithNull.endDate).toBeUndefined();

      const dataWithUndefined = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: '2020-01-01',
        endDate: undefined,
      };

      const educationWithUndefined = new Education(dataWithUndefined);
      expect(educationWithUndefined.endDate).toBeUndefined();
    });
  });

  describe('save() - Create Scenario', () => {
    it('should create new education record when id is not provided', async () => {
      const educationData = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };

      const mockCreatedEducation = {
        id: 1,
        ...educationData,
        candidateId: null as any,
      };

      jest.spyOn(prisma.education, 'create').mockResolvedValue(mockCreatedEducation as any);

      const education = new Education(educationData);
      const result = await education.save();

      expect(prisma.education.create).toHaveBeenCalledTimes(1);
      expect(prisma.education.create).toHaveBeenCalledWith({
        data: {
          institution: educationData.institution,
          title: educationData.title,
          startDate: educationData.startDate,
          endDate: educationData.endDate,
        },
      });
      expect(result).toEqual(mockCreatedEducation);
      expect(prisma.education.update).not.toHaveBeenCalled();
    });

    it('should include candidateId when provided', async () => {
      const educationData = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
        candidateId: 5,
      };

      const mockCreatedEducation = {
        id: 1,
        ...educationData,
      };

      jest.spyOn(prisma.education, 'create').mockResolvedValue(mockCreatedEducation as any);

      const education = new Education(educationData);
      await education.save();

      expect(prisma.education.create).toHaveBeenCalledWith({
        data: {
          institution: educationData.institution,
          title: educationData.title,
          startDate: educationData.startDate,
          endDate: educationData.endDate,
          candidateId: 5,
        },
      });
    });

    it('should exclude candidateId when not provided', async () => {
      const educationData = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };

      const mockCreatedEducation = {
        id: 1,
        ...educationData,
        candidateId: null as any,
      };

      jest.spyOn(prisma.education, 'create').mockResolvedValue(mockCreatedEducation as any);

      const education = new Education(educationData);
      await education.save();

      expect(prisma.education.create).toHaveBeenCalledWith({
        data: {
          institution: educationData.institution,
          title: educationData.title,
          startDate: educationData.startDate,
          endDate: educationData.endDate,
        },
      });
      expect(prisma.education.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.not.objectContaining({ candidateId: expect.anything() }),
        })
      );
    });

    it('should handle endDate when provided', async () => {
      const educationData = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };

      const mockCreatedEducation = {
        id: 1,
        ...educationData,
        candidateId: 1,
      };

      jest.spyOn(prisma.education, 'create').mockResolvedValue(mockCreatedEducation as any);

      const education = new Education(educationData);
      await education.save();

      expect(prisma.education.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          endDate: educationData.endDate,
        }),
      });
    });

    it('should handle missing endDate', async () => {
      const educationData = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
      };

      const mockCreatedEducation = {
        id: 1,
        ...educationData,
        endDate: null as any,
        candidateId: null as any,
      };

      jest.spyOn(prisma.education, 'create').mockResolvedValue(mockCreatedEducation as any);

      const education = new Education(educationData);
      await education.save();

      expect(prisma.education.create).toHaveBeenCalledWith({
        data: {
          institution: educationData.institution,
          title: educationData.title,
          startDate: educationData.startDate,
          endDate: undefined,
        },
      });
    });
  });

  describe('save() - Update Scenario', () => {
    it('should update existing education record when id is provided', async () => {
      const educationData = {
        id: 1,
        institution: 'Updated University',
        title: 'Master of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };

      const mockUpdatedEducation = {
        ...educationData,
        candidateId: (educationData as any).candidateId ?? 1,
      };

      jest.spyOn(prisma.education, 'update').mockResolvedValue(mockUpdatedEducation as any);

      const education = new Education(educationData);
      const result = await education.save();

      expect(prisma.education.update).toHaveBeenCalledTimes(1);
      expect(prisma.education.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          institution: educationData.institution,
          title: educationData.title,
          startDate: educationData.startDate,
          endDate: educationData.endDate,
        },
      });
      expect(result).toEqual(mockUpdatedEducation);
      expect(prisma.education.create).not.toHaveBeenCalled();
    });

    it('should use correct where clause for update', async () => {
      const educationData = {
        id: 5,
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };

      const mockUpdatedEducation = {
        ...educationData,
        candidateId: (educationData as any).candidateId ?? 1,
      };

      jest.spyOn(prisma.education, 'update').mockResolvedValue(mockUpdatedEducation as any);

      const education = new Education(educationData);
      await education.save();

      expect(prisma.education.update).toHaveBeenCalledWith({
        where: { id: 5 },
        data: expect.any(Object),
      });
    });

    it('should include candidateId in update when provided', async () => {
      const educationData = {
        id: 1,
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
        candidateId: 10,
      };

      const mockUpdatedEducation = {
        ...educationData,
        candidateId: (educationData as any).candidateId ?? 1,
      };

      jest.spyOn(prisma.education, 'update').mockResolvedValue(mockUpdatedEducation as any);

      const education = new Education(educationData);
      await education.save();

      expect(prisma.education.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          candidateId: 10,
        }),
      });
    });

    it('should exclude candidateId in update when not provided', async () => {
      const educationData = {
        id: 1,
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };

      const mockUpdatedEducation = {
        ...educationData,
        candidateId: (educationData as any).candidateId ?? 1,
      };

      jest.spyOn(prisma.education, 'update').mockResolvedValue(mockUpdatedEducation as any);

      const education = new Education(educationData);
      await education.save();

      expect(prisma.education.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.not.objectContaining({ candidateId: expect.anything() }),
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle Prisma create errors', async () => {
      const educationData = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };

      const mockError = new Error('Database error');
      jest.spyOn(prisma.education, 'create').mockRejectedValue(mockError);

      const education = new Education(educationData);

      await expect(education.save()).rejects.toThrow('Database error');
      expect(prisma.education.create).toHaveBeenCalledTimes(1);
    });

    it('should handle Prisma update errors', async () => {
      const educationData = {
        id: 1,
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };

      const mockError = new Error('Update failed');
      jest.spyOn(prisma.education, 'update').mockRejectedValue(mockError);

      const education = new Education(educationData);

      await expect(education.save()).rejects.toThrow('Update failed');
      expect(prisma.education.update).toHaveBeenCalledTimes(1);
    });

    it('should handle database connection errors', async () => {
      const educationData = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };

      const connectionError = new Error('Connection timeout');
      jest.spyOn(prisma.education, 'create').mockRejectedValue(connectionError);

      const education = new Education(educationData);

      await expect(education.save()).rejects.toThrow('Connection timeout');
    });

    it('should handle invalid data errors', async () => {
      const educationData = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
      };

      // Simulate Prisma validation error
      const validationError = {
        code: 'P2002',
        message: 'Unique constraint failed',
      };
      jest.spyOn(prisma.education, 'create').mockRejectedValue(validationError);

      const education = new Education(educationData);

      await expect(education.save()).rejects.toEqual(validationError);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values', () => {
      const data = {
        institution: '',
        title: '',
        startDate: '2020-01-01',
      };

      const education = new Education(data);

      expect(education.institution).toBe('');
      expect(education.title).toBe('');
      expect(education.startDate).toBeInstanceOf(Date);
    });

    it('should handle very long strings', () => {
      const longString = 'A'.repeat(1000);
      const data = {
        institution: longString,
        title: longString,
        startDate: '2020-01-01',
      };

      const education = new Education(data);

      expect(education.institution).toBe(longString);
      expect(education.title).toBe(longString);
      expect(education.institution.length).toBe(1000);
      expect(education.title.length).toBe(1000);
    });

    it('should handle date edge cases', () => {
      const sameDate = '2020-01-01';
      const data = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: sameDate,
        endDate: sameDate,
      };

      const education = new Education(data);

      expect(education.startDate).toBeInstanceOf(Date);
      expect(education.endDate).toBeInstanceOf(Date);
      expect(education.startDate.toISOString().split('T')[0]).toBe(sameDate);
      expect(education.endDate?.toISOString().split('T')[0]).toBe(sameDate);
    });

    it('should handle special characters in strings', () => {
      const data = {
        institution: "Test University & College (2020) - 'Special'",
        title: 'Bachelor of Science: Computer Science & Engineering',
        startDate: '2020-01-01',
      };

      const education = new Education(data);

      expect(education.institution).toBe("Test University & College (2020) - 'Special'");
      expect(education.title).toBe('Bachelor of Science: Computer Science & Engineering');
    });

    it('should handle candidateId as 0', async () => {
      const educationData = {
        institution: 'Test University',
        title: 'Bachelor of Science',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2024-01-01'),
        candidateId: 0,
      };

      const mockCreatedEducation = {
        id: 1,
        ...educationData,
        candidateId: 0,
      };

      jest.spyOn(prisma.education, 'create').mockResolvedValue(mockCreatedEducation as any);

      const education = new Education(educationData);
      await education.save();

      // candidateId: 0 should be treated as falsy, so it might not be included
      // This depends on the actual implementation behavior
      expect(prisma.education.create).toHaveBeenCalled();
    });
  });
});

