import { generateMAASURL } from "../../../utils";

context("Settings Kernel parameters", () => {
  beforeEach(() => {
    cy.login();
    cy.visit(generateMAASURL("/settings/configuration/kernel-parameters"));
  });

  it("can update kernel parameters", () => {
    const parameters = "sysrq_always_enabled dyndbg='file drivers/usb/*";
    const parametersInputLabel =
      /Global boot parameters always passed to the kernel/i;
    cy.findByLabelText(parametersInputLabel).type(parameters);
    cy.findByLabelText(/Save/).click();
    cy.findByLabelText(/Save/).should("be.disabled");
    cy.findByLabelText(parametersInputLabel).should("have.value", parameters);
  });
});
