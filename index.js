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

	var AppView = Backbone.View.extend({
		el: $("#noteapp"),
		statsTemplate: _.template($("#stats-template").html()),
		events: {
			"keypress #new-note": "createOnEnter",
			"click #clear-completed": "clearCompleted",
			"click #toggle-all": "toggleAllComplete"
		},
		initialize: function() {
			console.log(this);
			this.input = this.$("#new-note");
			this.allCheckbox = this.$("toggle-all")[0];

			this.listenTo(noteList, "add", this.addOne);
			this.listenTo(noteList, "reset", this.addAll);
			this.listenTo(noteList, "all", this.render);

			this.footer = this.$("footer");
			this.main = $("#main");

			noteList.fetch();
		},
		addOne: function(note) {
			var noteView = new NoteView({model: note});
			this.$("#note-list").append(view.render().el);
		},
		addAll: function() {
			noteList.each(this.addOne, this);
		},
		createOnEnter: function(e) {
			if(e.keyCode != 13) return;
			if(!this.input.val()) return;

			noteList.create({title: this.input.val()});
			this.input.val("");
		},
		clearCompleted: function() {
			_.invoke(noteList.done(), "destroy");
			return false;
		},
		toggleAllComplete: function() {
			var done = this.allCheckbox.checked;
			noteList.each(function(note) {
				note.save({"done": done});
			})
		}
	});

	var note = new AppView();
})