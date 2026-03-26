export const BLOCK_COLORS = {
  motion: '#4c97ff',
  looks: '#9966ff',
  sound: '#cf63cf',
  events: '#ffbf00',
  control: '#ffab19',
  sensing: '#5cb1d6',
  operators: '#59c059',
  variables: '#ff8c1a',
  myblocks: '#ff6680'
};

export const CATEGORIES = [
  ['motion', 'Движение'],
  ['looks', 'Внешность'],
  ['sound', 'Звук'],
  ['events', 'События'],
  ['control', 'Управление'],
  ['sensing', 'Сенсоры'],
  ['operators', 'Операторы'],
  ['variables', 'Переменные'],
  ['myblocks', 'Мои блоки']
];

const mk = (id, text, shape='stack', args=[]) => ({ id, text, shape, args });

export const BLOCK_LIBRARY = {
  events: [
    mk('event_whenflagclicked', 'когда нажат зелёный флаг', 'hat'),
    mk('event_whenkeypressed', 'когда клавиша [space] нажата', 'hat', [{key:'key', type:'select', value:'space'}]),
    mk('event_whenthisspriteclicked', 'когда этот спрайт нажат', 'hat'),
    mk('event_whenbackdropswitchesto', 'когда фон переключается на [backdrop1]', 'hat'),
    mk('event_whenbroadcastreceived', 'когда я получу [message1]', 'hat', [{key:'message', type:'text', value:'message1'}]),
    mk('event_broadcast', 'передать [message1]'),
    mk('event_broadcastandwait', 'передать [message1] и ждать')
  ],
  motion: [
    mk('motion_movesteps', 'идти [10] шагов', 'stack', [{key:'steps', type:'number', value:10}]),
    mk('motion_turnright', 'повернуть ↻ [15] градусов', 'stack', [{key:'deg', type:'number', value:15}]),
    mk('motion_turnleft', 'повернуть ↺ [15] градусов', 'stack', [{key:'deg', type:'number', value:15}]),
    mk('motion_gotoxy', 'перейти в x:[0] y:[0]', 'stack', [{key:'x', type:'number', value:0},{key:'y', type:'number', value:0}]),
    mk('motion_changexby', 'изменить x на [10]', 'stack', [{key:'x', type:'number', value:10}]),
    mk('motion_setx', 'установить x [0]', 'stack', [{key:'x', type:'number', value:0}]),
    mk('motion_changeyby', 'изменить y на [10]', 'stack', [{key:'y', type:'number', value:10}]),
    mk('motion_sety', 'установить y [0]', 'stack', [{key:'y', type:'number', value:0}]),
    mk('motion_ifonedgebounce', 'если край — оттолкнуться')
  ],
  looks: [
    mk('looks_sayforsecs', 'сказать [Привет!] [2] секунд', 'stack', [{key:'text', type:'text', value:'Привет!'},{key:'secs', type:'number', value:2}]),
    mk('looks_say', 'сказать [Привет!]', 'stack', [{key:'text', type:'text', value:'Привет!'}]),
    mk('looks_show', 'показать'), mk('looks_hide', 'скрыть'),
    mk('looks_nextcostume', 'следующий костюм'),
    mk('looks_changesizeby', 'изменить размер на [10]', 'stack', [{key:'v', type:'number', value:10}]),
    mk('looks_setsizeto', 'установить размер [100] %', 'stack', [{key:'v', type:'number', value:100}])
  ],
  sound: [
    mk('sound_play', 'воспроизвести звук [sound1]'),
    mk('sound_playuntildone', 'воспроизвести звук [sound1] до конца'),
    mk('sound_stopallsounds', 'остановить все звуки'),
    mk('sound_changevolumeby', 'изменить громкость на [10]'),
    mk('sound_setvolumeto', 'установить громкость [100]')
  ],
  control: [
    mk('control_wait', 'ждать [1] секунд', 'stack', [{key:'secs', type:'number', value:1}]),
    mk('control_repeat', 'повторить [10]', 'cblock', [{key:'times', type:'number', value:10}]),
    mk('control_forever', 'всегда', 'cblock'),
    mk('control_if', 'если <условие> то', 'cblock'),
    mk('control_if_else', 'если <условие> то иначе', 'ifelse'),
    mk('control_wait_until', 'ждать пока <условие>'),
    mk('control_repeat_until', 'повторять пока не <условие>', 'cblock'),
    mk('control_stop', 'остановить [all]'),
    mk('control_create_clone_of', 'создать клон [myself]'),
    mk('control_delete_this_clone', 'удалить клон'),
    mk('control_start_as_clone', 'когда я начинаюсь как клон', 'hat')
  ],
  sensing: [
    mk('sensing_touchingobject', 'касается [mouse-pointer]?', 'reporter'),
    mk('sensing_keypressed', 'клавиша [space] нажата?', 'reporter'),
    mk('sensing_mousedown', 'мышь нажата?', 'reporter'),
    mk('sensing_mousex', 'x мыши', 'reporter'),
    mk('sensing_mousey', 'y мыши', 'reporter'),
    mk('sensing_timer', 'таймер', 'reporter'),
    mk('sensing_resettimer', 'сбросить таймер')
  ],
  operators: [
    mk('operator_add', '[ ] + [ ]', 'reporter', [{key:'a',type:'number',value:0},{key:'b',type:'number',value:0}]),
    mk('operator_subtract', '[ ] - [ ]', 'reporter', [{key:'a',type:'number',value:0},{key:'b',type:'number',value:0}]),
    mk('operator_multiply', '[ ] * [ ]', 'reporter', [{key:'a',type:'number',value:1},{key:'b',type:'number',value:1}]),
    mk('operator_divide', '[ ] / [ ]', 'reporter', [{key:'a',type:'number',value:1},{key:'b',type:'number',value:1}]),
    mk('operator_random', 'случайное от [1] до [10]', 'reporter', [{key:'a',type:'number',value:1},{key:'b',type:'number',value:10}]),
    mk('operator_lt', '[ ] < [ ]', 'reporter'), mk('operator_gt', '[ ] > [ ]', 'reporter'), mk('operator_equals', '[ ] = [ ]', 'reporter')
  ],
  variables: [
    mk('data_setvariableto', 'установить [var] в [0]'),
    mk('data_changevariableby', 'изменить [var] на [1]'),
    mk('data_showvariable', 'показать переменную [var]'),
    mk('data_hidevariable', 'скрыть переменную [var]'),
    mk('data_addtolist', 'добавить [thing] в [list]'),
    mk('data_deletealloflist', 'удалить всё из [list]')
  ],
  myblocks: [mk('procedures_call', 'вызвать мой блок [name]')]
};

let seq = 1;
export function instantiateBlock(def) {
  return {
    uid: `b${seq++}`,
    opcode: def.id,
    category: Object.keys(BLOCK_LIBRARY).find(k => BLOCK_LIBRARY[k].some(b => b.id === def.id)),
    text: def.text,
    shape: def.shape,
    args: (def.args || []).map(a => ({...a})),
    substack: [],
    substack2: []
  };
}
