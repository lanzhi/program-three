var api_q = '/api/questions';
var api_a = '/api/answers';
var api_m = '/api/questions/more';
var app = new Vue({
    el: '#main',
    data: {
        count: 0,
        choices: [],
        currentLabel: {},
        question: [],
        str: [],
        startPos: 0,
        selections: [],
        keywords: [],
        answer: [],
        zIndex: 0,
        lIndex: -1,
        bkColor: []
    },

    computed: {
        width: function() {
            return ((this.zIndex + 1) / (this.count) * 100);
        }
    },

    created: function() {
        this.useQwest(api_q);
    },

    methods: {
        useQwest: function(api) {
            qwest.get(api).then(function(xhr, result) {
                if (result.status == 200 && result.data != false) {
                    this.$set('count', result.data.count);
                    this.$set('choices', result.data.labels);
                    this.$set('question', result.data.questions);
                    if (this.question.length == 0) {
                        alert("空题组");
                    };
                    this.init(this.question[0].content);
                } else if (result.data == false) {
                    this.zIndex = -1;
                } else {
                    alert('获取失败');
                }
            }.bind(this));
        },
        saveAnswer: function() {
            if (this.lIndex != -1) {
                if (this.zIndex == 0) {
                    this.zIndex = 1;
                };
                this.reset();
                qwest.post(api_a, this.answer, {
                    dataType: 'json',
                    responseType: 'json'
                }).then(function(xhr, result) {
                    if (result.status == 200) {
                        this.zIndex = -1;
                    } else {
                        alert('提交失败');
                    }
                }.bind(this));
            }
        },
        reset: function() {
            this.answer[this.zIndex - 1] = {
                question_id: this.question[this.zIndex - 1]._id,
                question_content: this.question[this.zIndex - 1].content,
                label_id: this.currentLabel._id,
                label_content: this.currentLabel.name,
                keywords: this.keywords,
                labelIndex: this.lIndex,
                currentSelection: this.selections
            };
        },
        theNext: function() {
            if (this.zIndex < this.count - 1 && this.lIndex != -1) {
                this.seleContent();
                this.zIndex++;
                this.reset();
                this.init(this.question[this.zIndex].content);
                this.selections = [];
                this.lIndex = -1;
                if (this.zIndex < this.answer.length) {
                    this.getLabels(this.answer[this.zIndex].labelIndex);
                    var curselections = this.answer[this.zIndex].currentSelection;
                    for (var i = 0; i < curselections.length; i++) {
                        this.editSelection(curselections[i].startPos, curselections[i].stopPos);
                    }
                }
            }
        },

        theLast: function() {
            if (this.zIndex > 0) {
                this.zIndex--;
                this.getLabels(this.answer[this.zIndex].labelIndex);
                this.init(this.question[this.zIndex].content);
                var curselections = this.answer[this.zIndex].currentSelection;
                for (var i = 0; i < curselections.length; i++) {
                    this.editSelection(curselections[i].startPos, curselections[i].stopPos);
                }
            }
        },

        seleContent: function() {
            this.keywords = [];
            for (var i = 0; i < this.selections.length; i++) {
                var con = '';
                this.str.forEach(function($el, str_index) {
                    if (str_index <= this.selections[i].stopPos && str_index >= this.selections[i].startPos) {
                        con = con + this.str[str_index];
                    };
                }.bind(this));
                if (con.length != 0) {
                    this.keywords.push({
                        content: con,
                        position: this.selections[i].startPos
                    });
                }
            };
        },

        getLabels: function(index) {
            this.lIndex = index;
            this.currentLabel = this.choices[index];
        },

        createSelection: function(startPos, stopPos) {
            return {
                startPos: startPos,
                stopPos: stopPos
            };
        },
        isInSelection: function(selection) {
            var is_object = typeof selection === 'object';

            for (var i = 0; i < this.selections.length; i += 1) {
                if (is_object) {
                    if (selection.startPos >= this.selections[i].startPos && selection.stopPos <= this.selections[i].stopPos) {
                        return i;
                    }
                } else {
                    if (selection >= this.selections[i].startPos && selection <= this.selections[i].stopPos) {
                        return i;
                    }
                }
            }
            return -1;
        },

        highlightSelection: function() {
            for (var i = 0; i < this.str.length; i++) {
                this.$set('bkColor[' + i + ']', 0);
            }
            this.str.forEach(function($el, str_index) {
                for (var i = 0; i < this.selections.length; i++) {
                    if (str_index <= this.selections[i].stopPos && str_index >= this.selections[i].startPos) {
                        this.$set('bkColor[' + str_index + ']', 1);
                    }
                }
            }.bind(this));
        },

        addToSelection: function(selection) {
            for (var i = 0; i < this.selections.length; i += 1) {
                if (this.selections[i].startPos == selection.startPos && this.selections[i].stopPos == selection.stopPos) {
                    return;
                }
            }

            this.selections.push(selection);
            this.selections = this.selections.sort(function(a, b) {
                return a.startPos - b.startPos;
            });

            this.highlightSelection();
        },

        editSelection: function(startPos, stopPos) {
            var tmp, i, selection_index;
            if (stopPos < startPos) {
                tmp = startPos;
                startPos = stopPos;
                stopPos = tmp;
            }
            var current_selection = this.createSelection(startPos, stopPos);
            var selection_index = this.isInSelection(current_selection);
            if (selection_index > -1) {
                this.selections.splice(selection_index, 1);
                this.highlightSelection();
            } else {
                for (i = startPos; i <= stopPos; i += 1) {
                    selection_index = this.isInSelection(i);
                    if (selection_index > -1) {
                        this.selections.splice(selection_index, 1);
                    }
                }
                this.addToSelection(current_selection);
            }
        },

        mouseDown: function(index) {
            window.event ? window.event.cancelBubble = true : e.stopPropagation();
            this.startPos = index;
        },

        mouseUp: function(index) {
            window.event ? window.event.cancelBubble = true : e.stopPropagation();
            this.editSelection(this.startPos, index);
            if (window.getSelection) {
                if (window.getSelection().empty) { // Chrome
                    window.getSelection().empty();
                } else if (window.getSelection().removeAllRanges) { // Firefox
                    window.getSelection().removeAllRanges();
                }
            } else if (document.selection) { // IE?
                document.selection.empty();
            }
        },

        touchStart: function(index) {
            event.preventDefault();
            event.stopPropagation();
            this.startPos = index;
        },

        touchEnd: function(index) {
            event.preventDefault();
            event.stopPropagation();
            var changedTouch = event.changedTouches[0];
            var elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
            this.mouseUp(elem.getAttribute("data-index"));
        },

        init: function(str) {
            this.str = str.split('');
            this.$set('bkColor ', this.str.map(function() {
                return 0;
            }));
        },

        moreQuestions: function() {
            this.zIndex = 0;
            this.keywords = [];
            this.selections = [];
            this.lIndex = -1;
            this.answer = [];
            this.startPos = 0;
            this.currentLabel = {};
            this.str = [];
            this.bkColor = [];
            this.useQwest(api_m);
        }
    }
});