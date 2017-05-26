function initializeGraph(data) {
  // loop through data
  //
}

function updateEdges(data) {

}


$(document).ready(function () {

  var G = new jsnx.Graph();

  var socket = io.connect("localhost:3000");
  console.log();
  socket.on('graphData', function (graphData) {

    console.log(graphData);

    initializeGraphGraph(G)

    jsnx.draw(G, {
        element: '#canvas',
        weighted: true,
        edgeStyle: {
          'stroke-width': 10
        }
      },
      true
    );

  });



  //
  // G.addNode(0);
  //
  //
  //
  // var i = 1;
  // setInterval(function () {
  //   console.log('adding node', i);
  //   G.addNode(i);
  //   i++;
  // }, 5000);

});
