Cypress.Commands.add('login', (userType = 'user') => {
  cy.session('user', () => {
     cy.request({
        method: 'POST',
        url: 'http://localhost:8787/auth/login',
        form: true,
        body: {
          email: 'testuser@example.com',
          password: 'password123',
        },
        followRedirect: false,
      }).then((response) => {
        expect(response.status).to.eq(302);
      });
    });
})

