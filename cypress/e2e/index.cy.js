describe('Home Page', () => {
  
  let mockUser = {
    username: 'luisstron45+21@gmail.com',
    password: '12345678978'
  };

  beforeEach(() => {
    
    cy.visit('http://localhost:4321');
  
  })

  it('should navigate to login, display the form, and authenticate the user ', () => {
    cy.contains('Acceder').click();
    cy.get("h2").should('have.text', 'Bienvenido de nuevo');
    
    cy.get("form").should('be.visible');

    cy.get("input[name='email']").should('be.visible').type(mockUser.username);
    cy.get("input[name='password']").should('be.visible').type(mockUser.password);
    
    cy.get("button.submit-form").should('be.visible').click();
    cy.url().should('include', '/dashboard');
  })

})


