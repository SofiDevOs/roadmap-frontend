describe("Admin: Create roadmaps", () => {
  
  beforeEach(() => {
    cy.login()

    cy.intercept('POST','**/roadmaps',(req) => {
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
      }
  
    }).as('createRoadmap');

    cy.visit('/dashboard/roadmaps/create');
  })
  
  it("should create a new roadmap without courses", () => {
    
    cy.get("input[name='title']").type('Roadmap de Prueba');
    cy.get("textarea[name='description']").type('Descripción del roadmap de prueba');
    cy.get("button#save[type='submit']").click();

    cy.wait('@createRoadmap').should(({response})=>{
      expect(response.statusCode).to.eq(201);
    })
  })

  it("should create a new roadmap with courses", () => {
    
    // Rellenar el formulario principal
    cy.get("input[name='title']").type('Roadmap de Prueba con Cursos');
    cy.get("textarea[name='description']").type('Descripción del roadmap de prueba con cursos');

    // Seleccionar un curso y agregarlo al roadmap
    cy.get("select[name='course']").select(1);
    cy.get("button#add-course").click();
    // Enviar el formulario
    cy.get("button#save[type='submit']").click();
    
    
    cy.wait("@createRoadmap").then(({ request, response }) => {
      const body =
        typeof request.body === "string" ? JSON.parse(request.body) : request.body;

      // courses_ids viene como string, parsearlo
      const coursesIds =
        typeof body.courses_ids === "string"
          ? JSON.parse(body.courses_ids)
          : body.courses_ids;

      expect(response.statusCode).to.eq(201);
      expect(coursesIds).to.have.length(1);
    });

  })

})
