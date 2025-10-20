
describe('/courses/create: Create courses', () => {
  beforeEach(() => {
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

    cy.intercept('POST','**/courses',{
      statusCode:200,
      body: {
        message: 'Curso creado con éxito',
      }
    }).as('createCourse');

    cy.visit('/dashboard/cursos/create');
  })

  it('should display course creation form', () => {
    cy.get('form#create-course').should('be.visible');
  })

  it('There should be an invisible input with the user ID in the value.', ()=>{
    cy.get('form#create-course').should('be.visible');
    cy.get("input[name='user_id']").should('have.attr', 'hidden', );
  })

  it('should create a new course with valid data', () => {
    cy.get("input[name='title']").type('Curso de Prueba');
    cy.get("textarea[name='description']").type('Descripción del curso de prueba');

    cy.get("button[type='submit']").and('have.text', 'Agregar').click();

    cy.wait('@createCourse').should(({response})=>{
      expect(response.statusCode).to.eq(200);
    })
  })

  it('should show error when required fields are missing', () => {
    cy.get("button[type='submit']").and('have.text', 'Agregar').click();
  })

})
