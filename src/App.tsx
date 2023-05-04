import React, { ButtonHTMLAttributes, ChangeEvent, ChangeEventHandler, EventHandler, MouseEventHandler, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

var CustomMap: { [key: string]: any } = {};
function App() {
  const [suggestion, setSuggestion] = React.useState("");
  const [suggestionList, setSuggestionList] = React.useState<string[]>([]);
  const [editSugIdx, setSugTodoIdx] = React.useState<number | null>();
  const [doneMap, setDoneMap] = React.useState<typeof CustomMap>({});
  
  useEffect(() => {
    const eListStr: string | null = localStorage.getItem('suggestionList') ?? "";
    const existingList: string[] = eListStr?.length > 0 ? JSON.parse(eListStr): [];
    setSuggestionList(existingList);
    let doneMap: typeof CustomMap; 
    if(localStorage.getItem('doneMap')) {
      doneMap = JSON.parse(localStorage.getItem('doneMap') ?? "");
    } else {
      doneMap = {};
    }
    setDoneMap(doneMap);
  }, []);
  
  const getExistingList = (): string[] => {
    const eListStr: string | null = localStorage.getItem('suggestionList') ?? "";
    const existingList: string[] = eListStr?.length > 0 ? JSON.parse(eListStr): [];    
    return existingList;
  };

  const CURRENT_THING = 'ecooooooooonmy';
  
  const saveTodoList = (toSave: string[]) => {
    localStorage.setItem('suggestionList', JSON.stringify(toSave));
    setSuggestionList(toSave);
  }
  
  const enterTodo: MouseEventHandler<Element> = () => {
    const existingList = getExistingList();
    console.log(suggestion);
    if (editSugIdx != null) {
      existingList[editSugIdx] = suggestion;
    } else {
      existingList.push(suggestion);
    }
    localStorage.setItem("suggestionList", JSON.stringify(existingList));
    setSuggestionList(existingList);
    setSuggestion("");
    setSugTodoIdx(null);
  };
  
  const editTodo: MouseEventHandler<Element> = (btn: React.MouseEvent<HTMLElement>) => {
    let temp = btn.target as HTMLTextAreaElement;
    const existingList = getExistingList();
    const nBeingEdited = Number(temp.value);
    const todo = existingList[Number(temp.value)];
    setSuggestion(todo);
    setSugTodoIdx(nBeingEdited);
  }
  const handleChange: ChangeEventHandler<Element> = (event: ChangeEvent) => {
    var elem = event.target as HTMLTextAreaElement;

    setSuggestion(elem.value);
  }
  const saveDoneTodo = (idxNoStr: string) => {
    const doneMap: typeof CustomMap = JSON.parse(localStorage.getItem('doneMap') ?? "{}");
    const idx = Number(idxNoStr);
    doneMap[idx] = !doneMap[idx];
    setDoneMap(doneMap);
    localStorage.setItem('doneMap', JSON.stringify(doneMap));

  }
  const markDone: MouseEventHandler<Element> = (btn: React.MouseEvent<HTMLElement>) => {
    const idxNoStr = (btn.target as HTMLTextAreaElement).value;
    saveDoneTodo(idxNoStr);
  }
  const markDoneChange: ChangeEventHandler<Element> = (event: ChangeEvent) => {
    var elem = event.target as HTMLTextAreaElement;
    saveDoneTodo(elem.value);
  }
  const deleteTodo: MouseEventHandler<Element> = (btn: React.MouseEvent<HTMLElement>) => {
    const idxNoStr = (btn.target as HTMLTextAreaElement).value;
    const idx = Number(idxNoStr);
    const existingList = getExistingList();
    existingList.splice(idx, 1);
    saveTodoList(existingList);
  }
  return (
    <div className="App">
      <header>
        <h2> Tech Chief Channel Suggestions</h2>
      </header>
      <div>
        <div>
          <div className='TodoArea'>
            <div>
              <input type='text' placeholder='enter suggestion' onChange={handleChange} value={suggestion} />
              <button onClick={enterTodo}> Save</button>  
            </div>
            <ul>
              {suggestionList.map( (t:string, idx: number) => (
                <div className='Todo' key={idx}>
                  {doneMap[idx] ? (
                    <input type='checkbox' checked value={""+idx} onChange={markDoneChange} />
                  ): (
                    <input type='checkbox' value={""+idx} onChange={markDoneChange} />
                  )}
                  <li> {t} </li> 
                  <p style={{marginLeft: 10}}>
                    <button value={""+idx} onClick={editTodo}> Edit</button>
                    <button style={{marginLeft: 10}} value={""+idx} onClick={deleteTodo}> Delete</button>
                    <button style={{marginLeft: 10}} value={""+idx} onClick={markDone}> Suggestion Used</button>
                  </p>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;