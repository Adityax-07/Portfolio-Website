const traceData = [
  {name:'agentbench.run',duration:'3.12s',color:'#777',start:0,width:100,depth:0,target:'complete',description:'An illustrative end-to-end run through the AgentBench research pipeline.'},
  {name:'planner.route',duration:'520ms',color:'#b8ef61',start:0,width:17,depth:1,target:'→ research',description:'The Planner breaks the task into focused steps before research begins.'},
  {name:'memory.recall',duration:'160ms',color:'#55bfe9',start:17,width:5,depth:1,target:'→ context',description:'SQLite agent memory recalls relevant context from earlier steps.'},
  {name:'researcher.run',duration:'1.76s',color:'#777',start:22,width:57,depth:1,target:'→ evidence',description:'The Researcher gathers evidence and hands it to the Analyst.'},
  {name:'tool.tavily',duration:'260ms',color:'#ff7442',start:23,width:8,depth:2,target:'→ search',description:'A Tavily tool call retrieves external information for the task.'},
  {name:'analyst.review',duration:'300ms',color:'#ff7442',start:32,width:9,depth:2,target:'→ findings',description:'The Analyst reviews the evidence and extracts useful findings.'},
  {name:'memory.write',duration:'380ms',color:'#ecc154',start:42,width:12,depth:2,target:'→ SQLite',description:'The pipeline records useful state in SQLite agent memory.'},
  {name:'writer.reply',duration:'700ms',color:'#b8ef61',start:55,width:22,depth:2,target:'→ response',description:'The Writer creates a structured answer from the analyzed evidence.'},
  {name:'eval.judge',duration:'640ms',color:'#e87db3',start:79,width:21,depth:1,target:'→ metrics',description:'An LLM-as-judge evaluates the response for quality, hallucination, relevance, latency and cost.'}
];

const rows = document.getElementById('trace-rows');
if (rows) {
  traceData.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'trace-row' + (index === 1 ? ' active' : '');
    button.style.setProperty('--bar-color', item.color);
    button.style.setProperty('--bar-start', item.start + '%');
    button.style.setProperty('--bar-width', item.width + '%');
    button.innerHTML = `<span class="label" style="padding-left:${item.depth * 15}px">${item.depth ? '└ ' : ''}${item.name}</span><span class="bar-track"><span class="bar"></span></span><span class="duration">${item.duration}</span>`;
    button.addEventListener('mouseenter', () => selectTrace(index));
    button.addEventListener('focus', () => selectTrace(index));
    button.addEventListener('click', () => selectTrace(index));
    rows.append(button);
  });
}
function selectTrace(index) {
  const item = traceData[index];
  document.querySelectorAll('.trace-row').forEach((row, i) => row.classList.toggle('active', i === index));
  document.getElementById('trace-name').textContent = item.name;
  document.getElementById('trace-duration').textContent = item.duration;
  document.getElementById('trace-target').textContent = item.target;
  document.getElementById('trace-description').textContent = item.description;
  document.querySelector('.trace-dot').style.background = item.color;
}

const activity = document.getElementById('activity-grid');
if (activity) {
  for (let col = 0; col < 53; col++) for (let row = 0; row < 7; row++) {
    const square = document.createElement('i');
    const x = (col * 61 + row * 47 + col * row * 13) % 101;
    const late = col > 28 ? 20 : 0;
    const level = x + late > 87 ? 4 : x + late > 70 ? 3 : x + late > 50 ? 2 : x + late > 37 ? 1 : 0;
    square.dataset.level = level;
    square.title = level ? `${level} contribution level` : 'No contributions';
    activity.append(square);
  }
}

const themeToggle = document.getElementById('theme-toggle');
function setTheme(light) {
  document.documentElement.classList.toggle('light', light);
  themeToggle.textContent = light ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', light ? 'Toggle dark theme' : 'Toggle light theme');
  localStorage.setItem('portfolio-theme', light ? 'light' : 'dark');
}
setTheme(localStorage.getItem('portfolio-theme') === 'light');
themeToggle.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('light')));
document.querySelectorAll('[data-theme-action]').forEach(button => button.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('light'))));

const dialog = document.getElementById('command-dialog');
const commandInput = document.getElementById('command-input');
const commandResults = document.getElementById('command-results');
const commands = [
  {name:'About',description:'The short version',href:'#about'},
  {name:'Experience',description:'Where I have worked',href:'#experience'},
  {name:'Selected work',description:'Four case studies',href:'#work'},
  {name:'How I build',description:'One agent run, traced',href:'#how-i-build'},
  {name:'More projects',description:'Things I have shipped',href:'#more-work'},
  {name:'Open source',description:'Four public frameworks',href:'#activity'},
  {name:'Stack',description:'Tools I reach for',href:'#stack'},
  {name:'Contact',description:'Say hello',href:'#contact'}
];
let commandSelection = 0;
function renderCommands() {
  const query = commandInput.value.trim().toLowerCase();
  const filtered = commands.filter(item => (item.name + ' ' + item.description).toLowerCase().includes(query));
  commandSelection = Math.min(commandSelection, Math.max(0, filtered.length - 1));
  commandResults.innerHTML = '';
  filtered.forEach((item, index) => {
    const button = document.createElement('button');
    button.className = index === commandSelection ? 'active' : '';
    button.innerHTML = `<span>${item.name}</span><small>${item.description}</small>`;
    button.addEventListener('mouseenter', () => {commandSelection = index; updateCommandSelection();});
    button.addEventListener('click', () => {dialog.close(); location.hash = item.href;});
    commandResults.append(button);
  });
  if (!filtered.length) commandResults.innerHTML = '<p style="padding:8px 12px;color:#888">No matching sections</p>';
}
function updateCommandSelection() {commandResults.querySelectorAll('button').forEach((button,i)=>button.classList.toggle('active',i===commandSelection));}
function openCommand() {dialog.showModal();commandInput.value='';commandSelection=0;renderCommands();commandInput.focus();}
document.getElementById('open-search').addEventListener('click', openCommand);
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {event.preventDefault();dialog.open ? dialog.close() : openCommand();}
  if (!dialog.open) return;
  const buttons = commandResults.querySelectorAll('button');
  if (event.key === 'ArrowDown' && buttons.length) {event.preventDefault();commandSelection = (commandSelection + 1) % buttons.length;updateCommandSelection();}
  if (event.key === 'ArrowUp' && buttons.length) {event.preventDefault();commandSelection = (commandSelection - 1 + buttons.length) % buttons.length;updateCommandSelection();}
  if (event.key === 'Enter' && buttons.length) {event.preventDefault();buttons[commandSelection].click();}
});
commandInput.addEventListener('input', () => {commandSelection=0;renderCommands();});
dialog.addEventListener('click', event => {if (event.target === dialog) dialog.close();});

document.getElementById('tokenize').addEventListener('click', () => {
  const output = document.getElementById('token-output');
  const words = 'agents retrieval tools memory evals reliability'.split(' ');
  output.innerHTML = '';
  words.forEach((word, i) => setTimeout(() => {
    const token = document.createElement('span');
    token.textContent = `[${word}] `;
    output.append(token);
  }, i * 110));
});
document.getElementById('replay-code').addEventListener('click', () => {
  const code = document.getElementById('whoami-code');
  code.animate([{opacity:.15},{opacity:1}],{duration:650,easing:'ease-out'});
});

document.querySelectorAll('.drag-sticker').forEach(sticker => {
  let startX=0,startY=0,baseX=0,baseY=0,dragging=false;
  sticker.addEventListener('pointerdown', event => {
    dragging=true;startX=event.clientX;startY=event.clientY;
    baseX=Number(sticker.dataset.x||0);baseY=Number(sticker.dataset.y||0);
    sticker.setPointerCapture(event.pointerId);sticker.style.zIndex=10;
  });
  sticker.addEventListener('pointermove', event => {
    if (!dragging) return;
    const x=baseX+event.clientX-startX,y=baseY+event.clientY-startY;
    sticker.dataset.x=x;sticker.dataset.y=y;
    sticker.style.translate=`${x}px ${y}px`;
  });
  sticker.addEventListener('pointerup', () => {dragging=false;sticker.style.zIndex=2;});
  sticker.addEventListener('pointercancel', () => {dragging=false;sticker.style.zIndex=2;});
});

const form = document.getElementById('contact-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const from=document.getElementById('contact-from').value.trim();
  const subject=document.getElementById('contact-subject').value.trim();
  const message=document.getElementById('contact-message').value.trim();
  const body=`From: ${from}\n\n${message}`;
  location.href=`mailto:aaditya85677@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

function updateClock(){document.getElementById('local-time').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date())+' GMT+5:30';}
updateClock();setInterval(updateClock,60000);

const keyboard = document.querySelector('#sticker-keyboard #keys');
if (keyboard) {
  for(let row=0;row<4;row++) for(let col=0;col<15;col++) {
    if(row===3 && col>4 && col<10) continue;
    const key=document.createElementNS('http://www.w3.org/2000/svg','rect');
    key.setAttribute('x',16+col*15.1+(row%2)*3);
    key.setAttribute('y',16+row*16);
    key.setAttribute('width',11);key.setAttribute('height',10);key.setAttribute('rx',1.5);
    keyboard.append(key);
  }
}

function placeSideNotes() {
  const pairs = [
    ['.note-work','#work'],
    ['.note-build','#how-i-build'],
    ['.note-activity','#activity'],
    ['.note-stack','#stack'],
    ['.note-contact','#contact']
  ];
  const pageTop = document.querySelector('.page-shell').getBoundingClientRect().top + window.scrollY;
  pairs.forEach(([noteSelector,sectionSelector]) => {
    const note = document.querySelector(noteSelector);
    const section = document.querySelector(sectionSelector);
    if (!note || !section) return;
    note.style.top = (section.getBoundingClientRect().top + window.scrollY - pageTop + 95) + 'px';
  });
}
placeSideNotes();
window.addEventListener('resize', placeSideNotes);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeSideNotes);
