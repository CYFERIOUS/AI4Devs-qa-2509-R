describe('API Integration Tests', () => {
  const apiUrl = Cypress.env('apiUrl');

  describe('Candidates API', () => {
    let createdCandidateId: number;

    afterEach(() => {
      // Cleanup: Delete created candidate
      if (createdCandidateId) {
        cy.deleteCandidate(createdCandidateId);
      }
    });

    it('should create a candidate via API', () => {
      const candidateData = {
        firstName: 'API',
        lastName: 'Test',
        email: `api.test.${Date.now()}@example.com`,
        phone: '+34 600 123 456',
        address: 'Test Address',
      };

      cy.createCandidate(candidateData).then((response) => {
        expect(response).to.have.property('id');
        createdCandidateId = response.id;
        expect(response.firstName).to.eq(candidateData.firstName);
        expect(response.lastName).to.eq(candidateData.lastName);
        expect(response.email).to.eq(candidateData.email);
      });
    });

    it('should create a candidate with education', () => {
      const candidateData = {
        firstName: 'Edu',
        lastName: 'Test',
        email: `edu.test.${Date.now()}@example.com`,
        educations: [
          {
            institution: 'Test University',
            title: 'Test Degree',
            startDate: '2020-01-01',
            endDate: '2024-01-01',
          },
        ],
      };

      cy.createCandidate(candidateData).then((response) => {
        expect(response).to.have.property('id');
        createdCandidateId = response.id;
        expect(response.educations).to.be.an('array');
        expect(response.educations.length).to.be.greaterThan(0);
      });
    });

    it('should create a candidate with work experience', () => {
      const candidateData = {
        firstName: 'Work',
        lastName: 'Test',
        email: `work.test.${Date.now()}@example.com`,
        workExperiences: [
          {
            company: 'Test Company',
            position: 'Test Position',
            description: 'Test Description',
            startDate: '2020-01-01',
            endDate: '2024-01-01',
          },
        ],
      };

      cy.createCandidate(candidateData).then((response) => {
        expect(response).to.have.property('id');
        createdCandidateId = response.id;
        expect(response.workExperiences).to.be.an('array');
        expect(response.workExperiences.length).to.be.greaterThan(0);
      });
    });

    it('should get all candidates', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/candidates`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('should get candidate by ID', () => {
      // First create a candidate
      const candidateData = {
        firstName: 'Get',
        lastName: 'Test',
        email: `get.test.${Date.now()}@example.com`,
      };

      cy.createCandidate(candidateData).then((createdCandidate) => {
        createdCandidateId = createdCandidate.id;

        // Then get it by ID
        cy.request({
          method: 'GET',
          url: `${apiUrl}/candidates/${createdCandidateId}`,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.id).to.eq(createdCandidateId);
          expect(response.body.email).to.eq(candidateData.email);
        });
      });
    });

    it('should handle duplicate email error', () => {
      const candidateData = {
        firstName: 'Duplicate',
        lastName: 'Test',
        email: `duplicate.${Date.now()}@example.com`,
      };

      cy.createCandidate(candidateData).then((response) => {
        createdCandidateId = response.id;

        // Try to create another candidate with the same email
        cy.request({
          method: 'POST',
          url: `${apiUrl}/candidates`,
          body: candidateData,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.be.oneOf([400, 409]);
        });
      });
    });

    it('should validate required fields', () => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/candidates`,
        body: {
          firstName: 'Test',
          // Missing lastName and email
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 422]);
      });
    });
  });

  describe('Positions API', () => {
    it('should get all positions', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/positions`,
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.be.an('array');
      });
    });

    it('should get position by ID', () => {
      cy.request({
        method: 'GET',
        url: `${apiUrl}/positions/1`,
        failOnStatusCode: false,
      }).then((response) => {
        // Either 200 if exists, or 404 if not
        expect(response.status).to.be.oneOf([200, 404]);
      });
    });
  });
});

