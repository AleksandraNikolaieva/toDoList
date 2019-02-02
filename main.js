$(function() {
	var ul = $('ul');
	var arrTasks = JSON.parse(localStorage.getItem('tasks')) || [];
	var nextTaskId = arrTasks.length > 0 ? arrTasks[arrTasks.length - 1].id + 1 : 0;

	window.onload = displayAllTasks();

	$('input[name=newTask]').on('click', function() {
		$(this).animate({
			width: '400px',
			opacity: '0',
		}, 500, function() {
			$('p:first').hide();
			$(this).hide();
			displayInfo();
			$('#tasksNum').fadeIn('slow');
			$('form').fadeIn('slow');
			$('form input[name=taskText]').focus();
		});
	})


	$('form input[name=addTask]').on('click', function() {
		var inpTaskText = $('input[name=taskText]');
		var taskText = $('input[name=taskText]').val().trim();
		if(taskText != '') {
			hideAttention(inpTaskText);
			makeLi(nextTaskId, taskText, false);
			saveTask(nextTaskId, taskText);
			nextTaskId++;
			inpTaskText.val('');
			displayInfo();
			$('input[name=deleteAll]').css('display', 'inline-block');
		} else {
			payAttention(inpTaskText);
		}
	});


	ul.on('click', 'li input[type=checkbox]', function() {
		$(this).change(function() {
			if(this.checked) {
				$(this).next().css("text-decoration", "line-through");
				setCheked($(this).parent().index(), true);
			} else {
				$(this).next().css("text-decoration", "none");
				setCheked($(this).parent().index(), false);
			}
		})
		displayInfo();
	})

	ul.on('click', 'li input.delete', function() {
		if(confirm('Are you sure that you want to delete this task?')) {
			arrTasks.splice($(this).parent().index(), 1);
			localStorage.setItem('tasks', JSON.stringify(arrTasks));
			$(this).parent().remove();
			displayInfo();
		}
	})

	$('input[name=deleteAll]').on('click', function() {
		if(confirm('Are you shure that you want to delete all tasks?')) {
			ul.html('');
			localStorage.removeItem('tasks');
			location.reload();
		}
	})

	function displayAllTasks() {
		for(var i = 0; i < arrTasks.length; i++) {
			makeLi(i, arrTasks[i].text, arrTasks[i].checked);
		}
		if(arrTasks.length != 0) {
			$('input[name=deleteAll]').css('display', 'inline-block');
			var unDoneTasks = $('input:checkbox:not(:checked)').length; 
			$('p:first').html(unDoneTasks + ' uncomplited ' + (unDoneTasks  == 1 ? ' task' : ' tasks') + ' by now.');
		}
	}
	
	function makeLi(_taskNum, _taskText, isChecked) {
		var li = `<li>
		<input type="checkbox" id="` + _taskNum + `task"` + (isChecked ? ' checked' : '') + `>
		<label for="` + _taskNum + `task">` + _taskText + `</label>
		<input type="button" class="delete">
		</li>`
		ul.append(li);
		if(isChecked) {
			$('label:eq(' + _taskNum + ')').css("text-decoration", "line-through")
		} else {
			$('label:eq(' + _taskNum + ')').css("text-decoration", "none");	
		}
	}

	function payAttention(el) {
		$('form input').css('background-color', '#ffe6ee');
		el.addClass('swing');
	}

	function hideAttention(el) {
		$('form input').css('background-color', '#ffffff');
		el.removeClass('swing');
	}

	function saveTask(_taskText) {
		var task = {
			text: _taskText,
			checked: false
		};
		arrTasks.push(task);
		localStorage.setItem('tasks', JSON.stringify(arrTasks));
	}

	function setCheked(taskNum, value) {
		arrTasks[taskNum].checked = value;
		localStorage.setItem('tasks', JSON.stringify(arrTasks));
	}

	function displayInfo() {
		$('#tasksNum').html(arrTasks.length + ' tasks by now.</br>' + $('input:checkbox:not(:checked)').length + ' of them undone.</br> Add new task down below:');
	}
})