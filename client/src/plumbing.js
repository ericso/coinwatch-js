module.exports = {
	showAlert: function(id, type, msg) {
		// Generate Bootstrap alert box in div w/ id
		$('#'+id).append($("<div class='alert alert-" + type + " fade in' data-alert><button type=\"button\" class=\"close\" data-dismiss=\"alert\">x</button>" + msg + "</div>"));
		$('#'+id+' .alert').delay(3000).fadeOut("slow", function() {
			$(this).remove();
		});
	},

	// unshowAlert: function(id) {
	//   $('#'+id+' .alert').alert('close');
	// }
};
