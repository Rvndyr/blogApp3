(function() { // protect the lemmings

	function GET(url) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open('GET', url);
			request.onload = () => {
				const data = JSON.parse(request.responseText);
				resolve(data)
			};
			request.onerror = (err) => {
				reject(err)
			};
			request.send();
		});
	} // GET

	function POST(url, data) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open('POST', url);
			request.setRequestHeader('Content-Type', 'application/json');

			request.onload = () => {
				const data = JSON.parse(request.responseText);
				resolve(data)
			};
			request.onerror = (err) => {
				reject(err)
			};

			request.send(JSON.stringify(data));
		});
	} // POST

	function PUT(url, data) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open('PUT', url);
			request.setRequestHeader('Content-Type', 'application/json');

			request.onload = () => {
				const data = JSON.parse(request.responseText);
				resolve(data)
			};
			request.onerror = (err) => {
				reject(err)
			};

			request.send(JSON.stringify(data));
		});
	} // POST


	function DELETE(url, data) {
		return new Promise((resolve, reject) => {
			const request = new XMLHttpRequest();
			request.open('DELETE', url);
			request.setRequestHeader('Content-Type', 'application/json');

			request.onload = () => {
				const data = JSON.parse(request.responseText);
				resolve(data)
			};
			request.onerror = (err) => {
				reject(err)
			};

			request.send(JSON.stringify(data));
		});
	} //DELETE

	function render(todoItems) {
		const container = document.querySelector('.js-todolist');
		container.innerHTML = '';
		for (const todoItem of todoItems) {
			const article = document.createElement('article');

			// delete button
			article.innerHTML = `<span class="glyphicon glyphicon-remove todolist-icon js-todo-remove"></span>`

			if (todoItem.data.isDone) {
				article.innerHTML += `<span class="glyphicon glyphicon-check todolist-icon js-todo-check green"></span>`
			}
			else {
				article.innerHTML += `<span class="glyphicon glyphicon-unchecked todolist-icon js-todo-check"></span>`
			}

			article.innerHTML += `
     <h5>${todoItem.data.title}</h5>
		  <h6>${todoItem.data.todo}</h6>
			`;

			article.classList.add('list-group-item', 'todolist-item');

			article.querySelector('.js-todo-remove').addEventListener('click', (e) => {
							console.log("The element was deleted.")
							const {id} = todoItem;
							console.log(id)
							DELETE('/api/todo/' + id)
								.then((data) => {
									render(data);
								})
								.catch((e) => {
									alert(e)
								});
							})

			container.appendChild(article);
			article.querySelector('.js-todo-check').addEventListener('click', (e) => {
				console.log(todoItem);
				let isDone;
				if (todoItem.data.isDone) {
					isDone = false;
				}
				else {
					isDone = true;
				}

				PUT('/api/todo/' + todoItem.id, {isDone})
					.then((data) => {
						render(data);
					})
					.catch((e) => {
						alert(e)
					})
			})

		}

		if (todoItems.length === 0) {
			container.innerHTML = `
<article class="list-group-item">
No todoitems!
</article>
			`;
		}
	} // render


	GET('/api/todos')
		.then((todoItems) => {
			render(todoItems);
		});

		const todo = document.querySelector('.js-add-todo');

		if (todo !== null) {

			todo.addEventListener('click', (e) => {
				const input = document.querySelector('.js-todo-body');
				const inputTitle = document.querySelector('.js-todo-title');
				input.setAttribute('disabled', 'disabled');

				POST('/api/todos', {
					title: inputTitle.value,
					todo: input.value,
					when: new Date().getTime() + 9 * 60 * 60 * 1000
				}).then((data) => {
					input.removeAttribute('disabled');
					input.value = '';
					inputTitle.removeAttribute('disabled');
					inputTitle.value = '';
					render(data);
				});
			})
		}

	// This render is to edit the posted blogs

	//Render todo items from lowDB with edit toggle and remove icons
    function renderFeed(todoItems) {
			console.log(todoItems)
        // const sortedData = todoItems.sortby(['id'])
        const container = document.querySelector('.js-postlist');
        container.innerHTML = '';
        // for (const todoItem of sortedData) {
        for (const todoItem of todoItems) {
            const div = document.createElement('div');
            div.innerHTML = `
            <article>
							<section>Date: ${todoItem.data.when}</section>
							<section><b>${todoItem.data.title}</b></section>

            </article>
            `;
            div.innerHTML += `<button type="button" rel="tooltip" title="Edit Task" class="btn btn-default js-todo-edit">
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                </button>`
            div.innerHTML += `<button type="button" rel="tooltip" title="Remove" class="btn btn-danger btn-simple js-todo-remove">
                    <i class="fa fa-times"></i>
                </button>
            `;
            container.appendChild(div);

//remove button which calls the DELETE :id
            div.querySelector('.js-todo-remove').addEventListener('click', (e) => {
                const { id } = todoItem;
                DELETE('/api/todo/' + id)
                    .then((data) => {
                        renderFeed(data);
                    })
                    .catch((e) => {
                        alert(e)
                    });
            });

//edit button which pushes data into inputs on the right hand side
            div.querySelector('.js-todo-edit').addEventListener('click', (e) => {
              console.log("edit button")
              const editBox = document.querySelector('.js-edit-box')
              editBox.innerHTML = ""
              editBox.innerHTML += `
              <div class="input-group">
              <input type="text" class=" js-update-title" placeholder="Title" aria-describedby="basic-addon1" value="${todoItem.data.title}">
              <input type="text" class=" js-update-text" placeholder="Body" aria-describedby="basic-addon1" value="${todoItem.data.todo}">
              </div>
              <div class="btn-group btn-group-justified" role="group" aria-label="...">
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-default js-update-put">Update</button>
                </div>
              </div>
              `;
                editBox.querySelector('.js-update-put').addEventListener('click', (e) => {
                   updatePost();
                })

            });

//Update button via PUT request from the edit section
            //Update
            const updatePost = () => {
              console.log("clicked updater")
                const updateTitle = document.querySelector('.js-update-title');
                // const { id } = todoItem;
                const mainInput = document.querySelector('.js-update-text');
                mainInput.setAttribute('disabled', 'disabled');
                console.log(updateTitle.value)


                PUT('/api/todo/' + todoItem.id, {
                  title: updateTitle.value,
                  todo: mainInput.value
                })
                .then((data) => {
                  console.log(data)
                    updateTitle.removeAttribute('disabled');
                    mainInput.removeAttribute('disabled');
                    updateTitle.value = '';
                    mainInput.value = '';
                    renderFeed(data);
                    console.log('rendered')
                }).catch((e) => {
                    alert(e)
                })



            }
        };
    };// End of render on page load

    //Initializer on page load
		if (document.querySelector('body.admin') !== null) {
			GET('/api/todos')
	        .then((todoItems) => {
	            renderFeed(todoItems);
	        });
		}


})();
