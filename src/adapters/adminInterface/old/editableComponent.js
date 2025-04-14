export function editableComponent(name){

  let   isEditing = false;
  const domEl     = document.getElementById(name);
  const editName  = "input_"+name;
  update("");

  function update(newContent){
    domEl.innerHTML = newContent;
    domEl.onclick   = editElement;
  }

  function editElement(){
    if (isEditing) return;
    domEl.innerHTML = /*html*/ `<input id="${editName}" value="${domEl.textContent}" type="text" />`;
    const btn     = document.createElement("button");
    btn.innerText = "ok";
    btn.onclick   = editTileEnd;
    domEl.appendChild(btn);
    isEditing = true;
  }

  function editTileEnd(e){
    e.stopPropagation();
    if (!isEditing) return;
    update(document.getElementById(editName).value);
    isEditing = false;
  }

  return {
    get value(){ return domEl.textContent; },
    update
  }
}