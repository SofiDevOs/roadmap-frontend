describe('Authentication', () => {
  
  const mockNewUser = {
    username: 'testuser',
    fullname: 'Test User',
    email: 'testuser@example.com',
    password: 'password123'
  };
  beforeEach(() => {
    cy.visit('http://localhost:4321/access/login');
  });

  // describe('Login', () => {
  //   it('should display login form', () => {
  //     // TODO: Implementar test
  //   });

  //   it('should login with valid credentials', () => {
  //     // TODO: Implementar test
  //   });

  //   it('should show error with invalid credentials', () => {
  //     // TODO: Implementar test
  //   });

  //   it('should redirect to dashboard after successful login', () => {
  //     // TODO: Implementar test
  //   });
  // });

  describe('Register', () => {
    it('should display registration form', () => {
      cy.get('a[href="/access/register"]').click();
      cy.url().should('include', '/access/register');
      cy.get('form').should('be.visible');
    });

    it('should register new user with valid data', () => {

      cy.intercept('POST', 'http://localhost:8787/auth/register', 
        { statusCode: 201, 
          body: {
            success: true,
            message: 'Cuenta creada con éxito, por favor revisa tu correo para verificarla.'
          }
        }).as('registerUser');
      
      cy.get('a[href="/access/register"]').click();
      cy.get("input[name='email']").type(mockNewUser.email);
      cy.get("input[name='username']").type(mockNewUser.username);
      cy.get("input[name='fullname']").type(mockNewUser.fullname);
      cy.get("input[name='password']").type(mockNewUser.password);
      cy.get("button.submit-form").click();
       
      cy.wait('@registerUser').should(({ response }) => {
        expect(response.statusCode).to.eq(201);
      });
      cy.wait(500);
      cy.get('.toast-message').contains('Cuenta creada con éxito, por favor revisa tu correo para verificarla.');
    });

    it('should validate form fields', () => {
      cy.get('a[href="/access/register"]').click();
      cy.wait(500);
      cy.get("input[name='email']").clear();
      cy.get("input[name='username']").clear();
      cy.get("input[name='fullname']").clear();
      cy.get("input[name='password']").clear();
      cy.get("button.submit-form").click();
      cy.get('.toast-alerts').should('not.have.text');
    });

    it('should show error for duplicate email', () => {
        cy.intercept('POST', 'http://localhost:8787/auth/register', 
        { statusCode: 409,
          body: {
            success: false,
            message: 'El correo electrónico ya está en uso.'
          }
        }).as('registerUser');

        cy.get('a[href="/access/register"]').click();
        cy.get("input[name='email']").type(mockNewUser.email);
        cy.get("input[name='username']").type(mockNewUser.username);
        cy.get("input[name='fullname']").type(mockNewUser.fullname);
        cy.get("input[name='password']").type(mockNewUser.password);
        cy.get("button.submit-form").click();

        cy.wait('@registerUser').should(({ response }) => {
          expect(response.statusCode).to.eq(409);
        });
        cy.get('.toast-message').contains('El nombre de usuario o correo electrónico ya existe.');
        
      });
    });
  });

  // describe('Logout', () => {
  //   it('should logout user and redirect to home', () => {
  //     // TODO: Implementar test
  //   });
  // });

