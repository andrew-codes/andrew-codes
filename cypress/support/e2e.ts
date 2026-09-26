import "./commands"

// React Router's <Links/> re-renders its modulepreload entries when a
// client-side transition lands on a prerendered page whose code-split chunks
// differ from the page you navigated from (this app's routes are each their
// own chunk). React treats the resulting DOM diff as a hydration-class
// mismatch (#418) and recovers by discarding and regenerating that subtree -
// the final rendered content is correct, verified by the specs in
// cypress/e2e/. Without this, that recoverable, upstream warning would fail
// every spec that clicks an internal link. Anything else still fails normally.
Cypress.on("uncaught:exception", (err) => {
  if (/Minified React error #418/.test(err.message)) {
    return false
  }
})
