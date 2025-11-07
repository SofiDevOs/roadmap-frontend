
describe('/courses/create: Create courses', () => {
  beforeEach(() => {
    
    cy.login()

    cy.intercept('POST','**/courses',(req) => {
      const body = typeof req.body === 'string' 
        ? JSON.parse(req.body) 
        : req.body;
      
      const { title, description, user_id } = body;
      
      if (!title || !description || !user_id) {
        req.reply({
          statusCode: 400,
        })
      } else {
        req.reply({
          statusCode: 201,
          body: {
            message: 'Roadmap creado con éxito',
          }
        })
      }    }).as('createCourse');

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
      expect(response.statusCode).to.eq(201);
    })
  })

  it('should show error when required fields are missing', () => {
    cy.get("button[type='submit']").and('have.text', 'Agregar').click();
  })

})
