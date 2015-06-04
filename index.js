$(function() {

	var Note = Backbone.Model.extend({
		defaults: function() {
			return {
				title: "take notes",
				order: 0,
				done: false
			}
		},
		toggle: function() {
			this.save({done: !this.get("done")});
		}
	});

	var NoteList = Backbone.Collection.extend({
		model: Note,
		localStorage: new Backbone.LocalStorage("_items"),
		done: function() {
			return this.where({done: true});
		},
		remaining: function() {
			return this.where({done: false});
		},
		nextOrder: function() {
			if(!this.length) return 1;
			return this.last().get("order") + 1;
		}
	});

	var noteList = new NoteList;

	var NoteView = Backbone.View.extend({
		tagName: "li",
		template: _.template($("#item-template").html()),
		events: {
			"click .toogle"		: "toggleDone",
			"dbClick .view"		: "edit",
			"click a.destroy"	: "clear",
	        "keypress .edit"  	: "updateOnEnter",
	        "blur .edit"      	: "close"
		},
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
			this.listenTo(this.model, "destroy", this.remove);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.toogleDone("done", this.model.get("done"));
			this.input = $(".edit");
			return this;
		},
		toogleDone: function() {
			this.model.toggle();
		},
		edit: function() {
			this.$el.addClass("editing");
			this.input.focus();
		},
		updateOnEnter: function(e) {
			if(e.keyCode == 13) this.close();
		},
		close: function() {
			var value = this.input.val();
			if(!value) {
				this.clear();
			}else {
				this.model.save({title: value});
				this.$el.removeClass("editing");
			}
		},
		clear: function() {
			this.model.destroy();
		}
	});

	var noteview = new NoteView;
})