


/**
 * Field Splitter plugin v 0.1.2
 *
 * Created by: Fernando Doglio (deleteman@gmail.com)
 *
 * Allows the programmer to turn a single input field into a multi field input. 
 *
 * The plugin's default behavior can be configured with an options hash:
 *
 * - defaultValue: The text used on the input when there is no text entered by the user (default: XXX)
 * - maxLength:    The max length allowed for that input (default: 3)
 * - numberOfFields: Number of fields to split the original one into. (default: 3)
 * - glue: 				 String to be used to join the fields and their value (default: "-")
 * - glueOriginal: When updating the original input field, do we use the glue string or not? (default: true)
 * 
*/ 
(function($) {
	$.fn.fieldSplit = function(options) {
		/** Main code **/
		options = options || {};

		/** Default values */
		var	DEFAULT_NUMBER_OF_FIELDS = 3;
		var DEFAULT_VALUE = "XXX";
		var DEFAULT_MAX_LENGTH = 3;
		var DEFAULT_GLUE = "-"; 
		var DEFAULT_GLUE_ORIGINAL = true;
        var DEFAULT_CALLBACK = function(){};

		var nmbr_fields, fieldId, new_part_field, default_value, max_length, glue, glueOriginal, callback;

	
		this.hide(); //hide the original element, it'll be updated anyways, in order to send it when posting the form
		var originalElement = this;

	  var container = $('<div class="multi-field"></div>');
	  this.parent().append(container);



		default_value = (typeof options.defaultValue 	 != "undefined")?options.defaultValue  :DEFAULT_VALUE;
		max_length 		= (typeof options.maxLength 	 	 != "undefined")?options.maxLength 	 	 :DEFAULT_MAX_LENGTH;
		nmbr_fields 	= (typeof options.numberOfFields != "undefined")?options.numberOfFields:DEFAULT_NUMBER_OF_FIELDS;
		glue 					= (typeof options.glue 					 != "undefined")?options.glue					 :DEFAULT_GLUE;
		glueOriginal  = (typeof options.glueOriginal	 != "undefined")?options.glueOriginal	 :DEFAULT_GLUE_ORIGINAL;
        callback  = (typeof options.callback	 == "function")?options.callback	 :DEFAULT_CALLBACK;


		

		/** Main loop for all selected elements */
		return this.each(function(i, elem){
			fieldId = $(elem).attr("id");

			var max_nmbr_fields = (typeof nmbr_fields == "function")?nmbr_fields():nmbr_fields;
			for(var idx = 1; idx <= max_nmbr_fields; idx++) {
				var lastField = idx == max_nmbr_fields;
				createPartField($(originalElement).attr("type"), fieldId, default_value, idx, max_length, container, lastField);
			}
		});


		/** Function that creates a "partial" field **/
		function createPartField(type, fieldId, default_value, idx, max_length, container, lastField){
					var maxL 		 = (typeof max_length == "function")?max_length(idx):max_length;
					var defValue = (typeof default_value == "function")?default_value(idx):default_value;

					new_part_field = $('<input type="' + type + '" id="' + fieldId + '_part' + idx + '" class="class_for_' + fieldId + ' part' + idx +'" maxlength = "' + maxL + '" />');
					container.append(new_part_field);
					if(!lastField) {
				  	container.append(glue);
					} else {
                        new_part_field.addClass("last-field");
                    }

					
					new_part_field.attr("defaultValue", defValue);
					new_part_field.attr("value", defValue); 
				
					/**
 					 * Sets the behavior need to jump from one field into the next one
 					 * automatically 
 					 * */
					new_part_field.keyup(function(){
						var field = $(this);
						$(originalElement).val(getCombinedInput(fieldId)); //Every time the user adds input, the original field is updated
						if(field.val().length == field.attr("maxlength")) {
							if(!field.hasClass("last-field")) {
								field.next().focus();
							} else {
                                callback.call(this);
                            }
						}					
					});

					new_part_field.focus(function() {
						$(this).addClass("active");
						if(this.value == this.defaultValue) {
							this.value = "";
						} 
					});

					new_part_field.blur(function() {
							if(this.value== "") {
								$(this).removeClass("active");
								this.value = this.defaultValue;
							} 
					});
			}

			/**
 			 * Gets the combined input from all of the parts 
 			 */
		  function getCombinedInput(id) {
				var inputs = [];
				$(".class_for_" + id).each(function(i, e) {
					inputs.push($(e).val());
				});
				return inputs.join((glueOriginal)?glue:"");
			}
	};
})(jQuery);
