self.addEventListener('message', function(e) {
  var cycles = e.data;
  postMessage("Calculating Pi using " + cycles + " cycles");
  var numbers = calculatePi(cycles);
  postMessage("Result: " + numbers);
}, false);

function calculatePi(cycles) {
  var pi = 0;
  var n  = 1;
  for (var i=0; i <= cycles; i++) {
    pi = pi + (4/n) - (4 / (n+2));
    n  = n  + 4;
  }
  return pi;
}