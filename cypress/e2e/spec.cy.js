describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:4321')
    cy.contains('Aprende a programar desde cero sin complicaiones')
  })
})
