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
			this.save(done: !this.get("done"));
		}
	});

	var NoteList ＝ Backbone.Collection.extend({
		model: Note,
		localStorage: new Backbone.localStorage("_items"),
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
		}
	});
})