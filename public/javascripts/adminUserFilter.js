$(document).ready(function () {
  $("#searchInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#usersTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});
