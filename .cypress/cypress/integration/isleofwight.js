describe('When you look at the Island Roads site', function() {

  beforeEach(function() {
    cy.server();
    cy.fixture('roads.xml');
    cy.route('/report/new/ajax*').as('report-ajax');
    cy.visit('http://isleofwight.localhost:3001/');
    cy.contains('Island Roads');
    cy.get('[name=pc]').type('PO30 5XJ');
    cy.get('[name=pc]').parents('form').submit();
  });

  it('uses the correct name', function() {
    cy.get('#map_box').click();
    cy.wait('@report-ajax');
    cy.get('select:eq(4)').select('Potholes');
    cy.contains('sent to Island Roads');
    cy.get('select:eq(4)').select('Private');
    cy.contains('sent to Island Roads');
    cy.get('select:eq(4)').select('Extra');
    cy.contains('Help Island Roads');
  });

  it('displays nearby roadworks', function() {
    cy.fixture('iow_roadworks.json');
    cy.route('/streetmanager.php**', 'fixture:iow_roadworks.json').as('roadworks');
    cy.visit('http://isleofwight.localhost:3001/');
    cy.get('[name=pc]').type('PO30 5XJ');
    cy.get('[name=pc]').parents('form').submit();
    cy.get('#map_box').click();
    cy.wait('@report-ajax');
    cy.wait('@roadworks');
    cy.contains('Roadworks are scheduled near this location');
  });
});
