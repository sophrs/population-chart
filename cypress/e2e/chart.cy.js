describe("PopulationChart", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("renders loading spinner while fetching data", () => {
    cy.intercept(
      "GET",
      "https://api.worldbank.org/v2/country?format=json&region=EUU",
      {
        statusCode: 200,
        body: [],
      }
    ).as("getPopulationData");

    cy.get("#loading-spinner").should("be.visible");
    cy.wait("@getPopulationData");
    cy.get("#loading-spinner").should("not.exist");
  });

  it("displays an error message if fetching fails", () => {
    cy.intercept(
      "GET",
      "https://api.worldbank.org/v2/country?format=json&region=EUU",
      {
        statusCode: 500,
        body: { error: "Failed to fetch data" },
      }
    ).as("getCountryListError");

    cy.contains("Sorry, something went wrong").should("be.visible");
  });

  it("renders chart with all countries' data by default", () => {
    cy.get("canvas").should("be.visible");
  });

  it("updates chart data when a specific country is selected", () => {
    cy.get('[role="combobox"]').click();

    cy.contains("Germany").click();
    cy.get('[role="combobox"]').should("have.text", "Germany");
    cy.get("canvas").should("be.visible");
  });
});
