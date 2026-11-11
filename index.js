import { BUILTIN_THEMES } from './themes.js';

const W = window, D = document; // 酒馆助手版构建时会去掉这一行
const KEY = 'love_theme_manager';
const ctx = () => SillyTavern.getContext();

/* ---------------- 默认设置 ---------------- */

const FIXES = [
    { group: 'chat', title: '聊天楼层', items: [
        ['center', '正文居中', '正文贴左或偏右时，自动居中。', true],
        ['noOverflow', '楼层不超出屏幕', '正则生成的 details 或长内容不会把楼层撑宽，手机上也限制宽度。', true],
        ['wrap', '长链接、长英文自动换行', '不会出现一整行超出去。', true],
        ['media', '表格、代码块、图片收进楼层', '太宽的内容缩到楼层宽度以内。', true],
        ['avatarFit', '头像居中、不拉伸', '头像在框里偏了或被压扁时自动修正。', true],
        ['nameEllipsis', '名字太长时省略', '超长角色名显示成「名字…」。', false],
    ] },
    { group: 'input', title: '输入区', items: [
        ['compact', '紧凑输入区', '打开酒馆的紧凑输入区域。', true],
        ['keyboard', '键盘弹出时输入框不被挡', '手机端用。', true],
        ['placeholder', '替换默认占位符', '用主题自带的句子，没有就用下面填的。', true],
        ['inputBtns', '发送、菜单按钮跟随主题色', '主题没改到的按钮也换成主题色。', false],
    ] },
    { group: 'panel', title: '面板与弹窗', items: [
        ['drawerHead', '扩展抽屉标题条', '去掉酒馆助手、正则等的默认渐变和圆角。', true],
        ['headers', '设置页小标题', '用户设置的 h4 和 standoutHeader 跟随主题。', true],
        ['toast', '右上角提示框', '去掉默认的绿色、蓝色和平铺图标。', true],
        ['icons', '默认小图标', '小铅笔、三个点这些图标换成主题色。', true],
        ['popupBtns', '确认弹窗按钮', '「确定/取消」统一样式。', false],
    ] },
    { group: 'preset', title: '预设列表', items: [
        ['noGrey', '禁用条目不变灰', '用虚线框区分开关，文字保持正常颜色。', true],
        ['noGreyPopup', '小铅笔弹窗里也不变灰', '编辑弹窗里同样处理。', true],
        ['tight', '条目行距收紧', '条目多时一屏能看到更多。', false],
    ] },
    { group: 'display', title: '显示与性能', items: [
        ['noScroll', '隐藏滚动条', '还能滚动，只是看不到滚动条。', true],
        ['fontFallback', '字体加载失败时用备用字体', '不会突然变回默认宋体。', true],
        ['safeArea', '刘海屏、底部横条留白', '顶栏和输入区不被挡住。', true],
        ['lowPower', '省电模式', '关掉动画、过渡和模糊，手机卡的时候用。', false],
    ] },
];

const SLOTS = [
    ['zi', '子时', '23–01'], ['chou', '丑时', '01–03'], ['yin', '寅时', '03–05'], ['mao', '卯时', '05–07'],
    ['chen', '辰时', '07–09'], ['si', '巳时', '09–11'], ['wu', '午时', '11–13'], ['wei', '未时', '13–15'],
    ['shen', '申时', '15–17'], ['you', '酉时', '17–19'], ['xu', '戌时', '19–21'], ['hai', '亥时', '21–23'],
];

const GF = 'https://fonts.googleapis.com/css2?family=';
const FONTS = {
    theme: { label: '跟随主题' },
    wenkai: { label: '霞鹜文楷', family: '"LXGW WenKai"', url: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css' },
    serif: { label: '思源宋体', family: '"Noto Serif SC"', url: GF + 'Noto+Serif+SC:wght@400;700&display=swap' },
    sans: { label: '思源黑体', family: '"Noto Sans SC"', url: GF + 'Noto+Sans+SC:wght@400;700&display=swap' },
    xiaowei: { label: '站酷小薇', family: '"ZCOOL XiaoWei"', url: GF + 'ZCOOL+XiaoWei&display=swap' },
    qingke: { label: '站酷庆科黄油体', family: '"ZCOOL QingKe HuangYou"', url: GF + 'ZCOOL+QingKe+HuangYou&display=swap' },
    kuaile: { label: '站酷快乐体', family: '"ZCOOL KuaiLe"', url: GF + 'ZCOOL+KuaiLe&display=swap' },
    mashan: { label: '马善政楷书', family: '"Ma Shan Zheng"', url: GF + 'Ma+Shan+Zheng&display=swap' },
    longcang: { label: '龙藏体', family: '"Long Cang"', url: GF + 'Long+Cang&display=swap' },
    songti: { label: '系统宋体', family: '"Songti SC", "STSong", "SimSun", serif' },
    kaiti: { label: '系统楷体', family: '"Kaiti SC", "STKaiti", "KaiTi", serif' },
    greatvibes: { label: 'Great Vibes', en: true, family: '"Great Vibes"', url: GF + 'Great+Vibes&display=swap' },
    pinyon: { label: 'Pinyon Script', en: true, family: '"Pinyon Script"', url: GF + 'Pinyon+Script&display=swap' },
    cormorant: { label: 'Cormorant', en: true, family: '"Cormorant Garamond"', url: GF + 'Cormorant+Garamond:ital,wght@0,500;1,500&display=swap' },
    playfair: { label: 'Playfair', en: true, family: '"Playfair Display"', url: GF + 'Playfair+Display:ital@0;1&display=swap' },
    cinzel: { label: 'Cinzel', en: true, family: '"Cinzel"', url: GF + 'Cinzel&display=swap' },
    special: { label: 'Special Elite', en: true, family: '"Special Elite"', url: GF + 'Special+Elite&display=swap' },
    custom: { label: '自定义' },
};

const SHAPES = [
    ['theme', '跟随主题', ''],
    ['circle', '圆形', 'border-radius:50%'],
    ['square', '方形', ''],
    ['rounded', '圆角方', 'border-radius:22%'],
    ['arch', '拱窗', 'border-radius:50% 50% 0 0;width:12px'],
    ['hex', '六边形', 'clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)'],
];

const LAYOUTS = [
    ['theme', '跟随主题', '<i class="b" style="left:4px;top:6px;right:4px;height:34px;background:repeating-linear-gradient(45deg,#D9CFBE 0 4px,#E6DECF 4px 8px)"></i>'],
    ['left', '左侧', '<i class="a" style="left:4px;top:6px;width:14px;height:14px"></i><i class="b" style="left:22px;top:6px;right:4px;height:34px"></i>'],
    ['right', '右侧', '<i class="a" style="right:4px;top:6px;width:14px;height:14px"></i><i class="b" style="right:22px;top:6px;left:4px;height:34px"></i>'],
    ['topl', '顶部靠左', '<i class="a" style="left:4px;top:2px;width:12px;height:12px"></i><i class="b" style="left:4px;top:18px;right:4px;height:26px"></i>'],
    ['topc', '顶部居中', '<i class="a" style="left:calc(50% - 8px);top:0;width:16px;height:16px"></i><i class="b" style="left:4px;top:20px;right:4px;height:24px"></i>'],
    ['topr', '顶部靠右', '<i class="a" style="right:4px;top:2px;width:12px;height:12px"></i><i class="b" style="left:4px;top:18px;right:4px;height:26px"></i>'],
    ['bigTop', '大头像 · 卡片顶图', '<i class="b" style="left:4px;top:0;right:4px;height:46px"></i><i class="a" style="left:4px;top:0;right:4px;height:30px;-webkit-mask-image:linear-gradient(#000 50%,transparent);mask-image:linear-gradient(#000 50%,transparent)"></i>'],
    ['bigCenter', '大头像 · 居中半身', '<i class="b" style="left:4px;top:4px;right:4px;height:42px"></i><i class="a" style="left:calc(50% - 13px);top:0;width:26px;height:32px;-webkit-mask-image:linear-gradient(#000 50%,transparent);mask-image:linear-gradient(#000 50%,transparent)"></i>'],
    ['bigSide', '大头像 · 左侧立绘', '<i class="b" style="left:4px;top:0;right:4px;height:46px"></i><i class="a" style="left:4px;top:0;width:22px;height:46px;-webkit-mask-image:linear-gradient(90deg,#000 50%,transparent);mask-image:linear-gradient(90deg,#000 50%,transparent)"></i>'],
    ['corner', '压在边角', '<i class="b" style="left:8px;top:8px;right:4px;height:36px"></i><i class="a" style="left:2px;top:2px;width:14px;height:14px"></i>'],
    ['none', '隐藏', '<i class="b" style="left:4px;top:6px;right:4px;height:34px"></i>'],
];

const RANDOM_OPTS = [['off', '关'], ['day', '每天一个'], ['load', '每次进来']];
const QUICK_FONTS = [['theme', '跟随主题'], ['wenkai', '文楷'], ['serif', '宋体'], ['sans', '黑体'], ['kaiti', '楷体'], ['xiaowei', '小薇']];

const PRESETS = [
    ['聊天式', '角色左 · 我右', { layC: 'left', layU: 'right' }],
    ['小说式', '都在顶部居中', { layC: 'topc', layU: 'topc' }],
    ['沉浸式', '角色压角 · 我隐藏', { layC: 'corner', layU: 'none' }],
    ['大头像式', '角色顶图 · 我右', { layC: 'bigTop', layU: 'right' }],
];

function defaults() {
    const fixes = {};
    FIXES.forEach(g => g.items.forEach(([k, , , on]) => { fixes[k] = on; }));
    return {
        themes: [],
        activeCss: null,
        prevTheme: null,
        placeholderFallback: '',
        fonts: [],
        auto: { time: false, slots: {}, char: false, charMap: {}, pickColor: false, dayNight: false, day: '', night: '', dayStart: 7, nightStart: 19, random: 'off', randDay: '', randId: '' },
        fixes,
        font: { body: 'theme', name: 'theme', customUrl: '', customFamily: '', size: 0, lh: 0, ls: null, pg: null, onlyBody: true },
        avatar: { shapeC: 'theme', shapeU: 'theme', layC: 'theme', layU: 'theme', sizeC: 0, sizeU: 0, mobileBig: false, bigH: 100, bigPos: 20, bigFade: true, fullRes: true },
        open: { themes: true },
    };
}

function S() {
    const es = ctx().extensionSettings;
    if (!es[KEY]) es[KEY] = defaults();
    const d = defaults();
    const s = es[KEY];
    for (const k of Object.keys(d)) {
        if (s[k] === undefined) s[k] = d[k];
        else if (d[k] && typeof d[k] === 'object' && !Array.isArray(d[k])) {
            for (const kk of Object.keys(d[k])) if (s[k][kk] === undefined) s[k][kk] = d[k][kk];
        }
    }
    for (const k of ['layC', 'layU']) if (s.avatar[k] === 'banner') s.avatar[k] = 'bigTop';
    return s;
}
const save = () => ctx().saveSettingsDebounced();

function getPath(path) { return path.split('.').reduce((o, k) => o?.[k], S()); }
function setPath(path, v) {
    const ks = path.split('.'); const last = ks.pop();
    const o = ks.reduce((o, k) => o[k], S()); o[last] = v; save();
}

/* ---------------- 主题库 ---------------- */

function allThemes() {
    const user = S().themes;
    return [...BUILTIN_THEMES.map(t => ({ ...t, builtin: true, desc: user.find(u => u.id === t.id)?.desc ?? t.desc })), ...user.filter(u => !u.overrideOf)];
}
function findTheme(id) { return allThemes().find(t => t.id === id); }
function themeName(t) { return t.kind === 'json' ? t.data?.name : t.name; }
function currentStTheme() { return String($('#themes').val() ?? ''); }

function isActive(t) {
    return t.kind === 'json' ? currentStTheme() === t.data?.name : S().activeCss === t.id;
}

async function ensureStTheme(data) {
    const exists = () => $('#themes option').toArray().some(o => o.value === data.name);
    if (exists()) return true;
    const input = document.getElementById('ui_preset_import_file');
    if (input) {
        const file = new File([JSON.stringify(data)], `${data.name}.json`, { type: 'application/json' });
        const dt = new DataTransfer(); dt.items.add(file); input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        for (let i = 0; i < 50; i++) { await new Promise(r => setTimeout(r, 100)); if (exists()) return true; }
    }
    try {
        await fetch('/api/themes/save', { method: 'POST', headers: ctx().getRequestHeaders(), body: JSON.stringify(data) });
        toastr.info('主题已保存，刷新页面后可以使用。', '美化器');
    } catch (e) { toastr.error('主题导入失败。', '美化器'); }
    return false;
}

/* ---- 绑定背景图 ---- */
function tval(t, k) { const ov = S().themes.find(x => x.overrideOf === t.id) || {}; return ov[k] ?? t[k]; }
// 一个主题可以绑多张背景：bgs 是列表，bgMain 是主背景，bgMode 是 'main'（用主背景）或 'random'（随机一张）
function bgsOf(t) {
    if (!t) return [];
    const list = tval(t, 'bgs');
    if (Array.isArray(list)) return list.filter(Boolean);
    const one = tval(t, 'bg'); return one ? [one] : [];
}
function bgMainOf(t) { const list = bgsOf(t); const m = tval(t, 'bgMain'); return list.includes(m) ? m : (list[0] || ''); }
function bgOf(t) {
    const list = bgsOf(t); if (!list.length) return '';
    if (tval(t, 'bgMode') === 'random' && list.length > 1) {
        const cur = currentBg(); const pool = list.filter(b => b !== cur);
        return pool[Math.floor(Math.random() * pool.length)] || list[0];
    }
    return bgMainOf(t);
}
function setBgs(id, list, main) {
    list = [...new Set(list.filter(Boolean))];
    editTheme(id, 'bgs', list);
    editTheme(id, 'bg', undefined);
    if (main !== undefined) editTheme(id, 'bgMain', main);
    const t = findTheme(id); if (t && !list.includes(tval(t, 'bgMain'))) editTheme(id, 'bgMain', list[0] || '');
}
const bgThumb = b => `/thumbnail?type=bg&file=${encodeURIComponent(b).replace(/'/g, '%27')}`;
let openMore = null, openPick = null;
function bgList() { return [...new Set($('.bg_example').toArray().map(e => e.getAttribute('bgfile')).filter(Boolean))]; }
function currentBg() {
    const el = D.getElementById('bg1');
    const m = el && getComputedStyle(el).backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (!m) return '';
    try { return decodeURIComponent(new URL(m[1], W.location.href).pathname).replace(/^.*\/backgrounds\//, ''); } catch { return ''; }
}
async function applyBg(name, { remember = true } = {}) {
    if (!name || currentBg() === name) return;
    if (remember) { S().prevBg = currentBg(); save(); }
    const el = $('.bg_example').filter((i, e) => e.getAttribute('bgfile') === name).first();
    if (el.length) { el.trigger('click'); return; }
    const c = ctx(); const run = c.executeSlashCommandsWithOptions || c.executeSlashCommands;
    if (run) { try { await run.call(c, `/bg ${name}`); } catch { toastr.warning(`找不到背景「${name}」`, '美化器'); } }
}

async function useTheme(id, { silent = false } = {}) {
    const t = findTheme(id); if (!t) return;
    if (t.kind === 'css') {
        S().activeCss = S().activeCss === id ? null : id; save();
        if (S().activeCss === id) applyBg(bgOf(t));
        applyAll(); renderThemes(); return;
    }
    const cur = currentStTheme();
    if (cur === t.data.name) { applyBg(bgOf(t)); return; }
    if (!(await ensureStTheme(t.data))) return;
    S().prevTheme = cur; save();
    $('#themes').val(t.data.name).trigger('change');
    applyBg(bgOf(t));
    if (!silent) toastr.success(`已切换到「${t.data.name}」`, '美化器');
    setTimeout(() => { applyAll(); renderThemes(); }, 300);
}

function undoTheme() {
    const p = S().prevTheme; if (!p) { toastr.info('没有可以撤销的切换。', '美化器'); return; }
    const cur = currentStTheme(); S().prevTheme = cur;
    const pb = S().prevBg; if (pb) { S().prevBg = currentBg(); applyBg(pb, { remember: false }); }
    save();
    $('#themes').val(p).trigger('change');
    setTimeout(() => { applyAll(); renderThemes(); }, 300);
}

function coverOf(t) {
    if (t.cover) return `background:url('${t.cover}') center/cover`;
    const bg = bgMainOf(t);
    const img = bg ? `url('${bgThumb(bg)}') center/cover, ` : '';
    if (t.kind === 'json' && t.data) {
        const a = t.data.blur_tint_color || '#2A2622', b = t.data.quote_color || t.data.main_text_color || '#B23A48';
        return `background:${img}linear-gradient(135deg, ${a} 0 62%, ${b} 62% 100%)`;
    }
    if (img) return `background:${img}transparent`;
    return 'background:repeating-linear-gradient(45deg,#D9CFBE 0 6px,#E6DECF 6px 12px)';
}

async function importFiles(files) {
    let n = 0;
    for (const f of files) {
        const text = await f.text();
        const base = f.name.replace(/\.(json|css)$/i, '');
        if (/\.css$/i.test(f.name)) {
            S().themes.push({ id: 'u' + Date.now() + n, kind: 'css', name: base, css: text, desc: '', series: '导入', placeholder: '' });
            n++; continue;
        }
        try {
            const data = JSON.parse(text);
            if (!data.name) data.name = base;
            const old = S().themes.find(t => t.kind === 'json' && t.data?.name === data.name);
            const entry = {
                id: old?.id || 'u' + Date.now() + n, kind: 'json', data,
                desc: data.love_desc ?? old?.desc ?? '', series: data.love_series ?? old?.series ?? '导入',
                placeholder: data.love_placeholder ?? old?.placeholder ?? '', cover: old?.cover, bgs: data.love_bg ? [].concat(data.love_bg) : (old?.bgs ?? (old?.bg ? [old.bg] : [])), bgMain: old?.bgMain, bgMode: data.love_bg_mode ?? old?.bgMode,
            };
            if (old) Object.assign(old, entry); else S().themes.push(entry);
            n++;
        } catch { toastr.error(`${f.name} 不是有效的 JSON。`, '美化器'); }
    }
    save(); renderThemes(); renderSlots(); renderDayNight();
    if (n) toastr.success(`导入了 ${n} 个主题。`, '美化器');
}

function editTheme(id, field, value) {
    let t = S().themes.find(x => x.id === id);
    if (!t) { // 内置主题的简介等存成覆盖项
        t = S().themes.find(x => x.overrideOf === id);
        if (!t) { t = { id, overrideOf: id }; S().themes.push(t); }
    }
    t[field] = value; save();
}

function removeTheme(id) {
    S().themes = S().themes.filter(t => t.id !== id);
    if (S().activeCss === id) S().activeCss = null;
    save(); applyAll(); renderThemes(); renderSlots();
}

function setCover(id) {
    const inp = Object.assign(document.createElement('input'), { type: 'file', accept: 'image/*' });
    inp.onchange = async () => {
        const f = inp.files[0]; if (!f) return;
        const img = await createImageBitmap(f);
        const c = document.createElement('canvas'); const r = 240 / Math.max(img.width, img.height);
        c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        editTheme(id, 'cover', c.toDataURL('image/jpeg', 0.8)); renderThemes();
    };
    inp.click();
}

/* ---------------- 自动 ---------------- */

function slotNow() { const h = new Date().getHours(); return SLOTS[Math.floor(((h + 1) % 24) / 2)][0]; }

let lastAutoKey = null;
function isDayNow() {
    const a = S().auto; const h = new Date().getHours();
    const d = +a.dayStart, n = +a.nightStart;
    return d <= n ? (h >= d && h < n) : !(h >= n && h < d);
}
function autoTime(force = false) {
    const a = S().auto; let key = null, id = null;
    if (a.dayNight) { const day = isDayNow(); key = day ? 'day' : 'night'; id = day ? a.day : a.night; }
    else if (a.time) { key = slotNow(); id = a.slots[key]; }
    if (!key) { lastAutoKey = null; return; }
    if (!force && key === lastAutoKey) return; // 只在时间段变化时切换，不打断手动换的主题
    lastAutoKey = key;
    const t = id && findTheme(id);
    if (t && !isActive(t)) useTheme(id, { silent: true });
}

function jsonThemes() { return allThemes().filter(t => t.kind === 'json' && t.data); }
function randomTheme({ silent = false } = {}) {
    const list = jsonThemes().filter(t => !isActive(t));
    if (!list.length) { if (!silent) toastr.info('主题列表里至少要有两个主题。', '美化器'); return null; }
    const t = list[Math.floor(Math.random() * list.length)];
    useTheme(t.id, { silent }); return t;
}
function autoRandom() {
    const a = S().auto;
    if (a.time || a.dayNight || a.random === 'off') return; // 按时间切换优先
    if (a.random === 'load') { randomTheme({ silent: true }); return; }
    const today = new Date().toDateString();
    const kept = findTheme(a.randId);
    if (a.randDay !== today || !kept) {
        const t = randomTheme({ silent: true });
        if (t) { a.randDay = today; a.randId = t.id; save(); }
    } else if (!isActive(kept)) useTheme(kept.id, { silent: true });
}

function charKey() {
    const c = ctx(); const ch = c.characters?.[c.characterId];
    return ch ? { key: ch.avatar, name: ch.name } : null;
}

function autoChar() {
    if (!S().auto.char) return;
    const k = charKey(); if (!k) return;
    const id = S().auto.charMap[k.key]?.id;
    if (id && findTheme(id)) useTheme(id, { silent: true });
}

let pickedColor = null;
async function pickColor() {
    pickedColor = null;
    if (!S().auto.pickColor) { applyAll(); return; }
    const el = document.getElementById('bg1') || document.getElementById('bg_custom');
    const m = el && getComputedStyle(el).backgroundImage.match(/url\(["']?(.*?)["']?\)/);
    if (!m) { applyAll(); return; }
    try {
        const img = new Image(); img.crossOrigin = 'anonymous'; img.src = m[1];
        await img.decode();
        const c = document.createElement('canvas'); c.width = c.height = 48;
        const g = c.getContext('2d'); g.drawImage(img, 0, 0, 48, 48);
        const px = g.getImageData(0, 0, 48, 48).data;
        const buckets = {};
        for (let i = 0; i < px.length; i += 4) {
            const [r, gg, b] = [px[i], px[i + 1], px[i + 2]];
            const max = Math.max(r, gg, b), min = Math.min(r, gg, b);
            const sat = max ? (max - min) / max : 0, val = max / 255;
            if (val < 0.25 || val > 0.97) continue;
            const key = `${r >> 5},${gg >> 5},${b >> 5}`;
            const w = sat * sat + 0.05;
            const o = buckets[key] || (buckets[key] = { w: 0, r: 0, g: 0, b: 0 });
            o.w += w; o.r += r * w; o.g += gg * w; o.b += b * w;
        }
        const best = Object.values(buckets).sort((a, b) => b.w - a.w)[0];
        if (best) pickedColor = `rgb(${Math.round(best.r / best.w)}, ${Math.round(best.g / best.w)}, ${Math.round(best.b / best.w)})`;
    } catch { /* 跨域图片取不到色，跳过 */ }
    applyAll();
}

/* ---------------- 修正 CSS ---------------- */

const DRAWER = '#extensions_settings .inline-drawer-toggle.inline-drawer-header, #extensions_settings2 .inline-drawer-toggle.inline-drawer-header';
const DRAWER_H = '#extensions_settings .inline-drawer-toggle.inline-drawer-header:hover, #extensions_settings2 .inline-drawer-toggle.inline-drawer-header:hover';
const PM_DIS = '#completion_prompt_manager #completion_prompt_manager_list li.completion_prompt_manager_prompt_disabled';

const FIX_CSS = {
    center: `
#chat .mes .mes_block { min-width: 0; flex: 1 1 auto; }
#chat .mes .mes_text { width: 100%; box-sizing: border-box; margin-inline: auto; padding-inline: 0.2em; }`,
    noOverflow: `
#chat { overflow-x: hidden; }
#chat .mes, #chat .mes .mes_block, #chat .mes .mes_text { min-width: 0; max-width: 100%; box-sizing: border-box; }
#chat .mes .mes_text :is(div, p, details, summary, section, span, blockquote) { max-width: 100%; box-sizing: border-box; }
#chat .mes .mes_text :is(details, summary) { white-space: normal; }
#chat .mes .mes_text [style*="nowrap"] { white-space: normal !important; }
#chat .mes .mes_text [style*="width"] { max-width: 100% !important; }`,
    wrap: `
#chat .mes .mes_text { overflow-wrap: anywhere; }`,
    media: `
#chat .mes .mes_text :is(img, video, iframe, canvas, svg) { max-width: 100%; height: auto; }
#chat .mes .mes_text table { display: block; max-width: 100%; overflow-x: auto; }
#chat .mes .mes_text pre { white-space: pre-wrap; overflow-wrap: anywhere; max-width: 100%; }`,
    avatarFit: `
#chat .mes .avatar { display: flex; align-items: center; justify-content: center; }
#chat .mes .avatar img { object-fit: cover; object-position: center top; }`,
    nameEllipsis: `
#chat .mes .ch_name { min-width: 0; }
#chat .mes .name_text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 55vw; }`,
    inputBtns: `
#send_form :is(#send_but, #options_button, #extensionsMenuButton, #mes_continue, #mes_stop, #mes_impersonate) { color: var(--SmartThemeQuoteColor); opacity: 1; }`,
    drawerHead: `
${DRAWER} { background-image: none; background-color: color-mix(in srgb, var(--SmartThemeBlurTintColor) 86%, var(--SmartThemeQuoteColor)); border: none; border-radius: 0; box-shadow: none; color: var(--SmartThemeBodyColor); }
${DRAWER_H} { background-image: none; background-color: color-mix(in srgb, var(--SmartThemeBlurTintColor) 72%, var(--SmartThemeQuoteColor)); }`,
    headers: `
#user-settings-block h4, .standoutHeader { background-image: none; background-color: transparent; border: none; border-radius: 0; box-shadow: none; color: var(--SmartThemeQuoteColor); letter-spacing: 0.08em; }`,
    toast: `
body #toast-container > div { background-color: var(--SmartThemeBlurTintColor); color: var(--SmartThemeBodyColor); border: 1px solid var(--SmartThemeBorderColor); border-radius: 2px; box-shadow: 0 8px 22px rgba(0,0,0,0.28); opacity: 1; padding: 12px 16px; }
body #toast-container > div:hover { box-shadow: 0 8px 22px rgba(0,0,0,0.38); }
#toast-container > .toast-success, #toast-container > .toast-info, #toast-container > .toast-warning, #toast-container > .toast-error { background-image: none !important; }
body #toast-container .toast-title { color: var(--SmartThemeQuoteColor); letter-spacing: 0.06em; }
body #toast-container .toast-progress { background-color: var(--SmartThemeQuoteColor); }`,
    icons: `
#chat .mes :is(.mes_buttons .mes_button, .extraMesButtons .mes_button, .mes_edit_buttons .menu_button, .mes_edit) { color: var(--SmartThemeQuoteColor); filter: none; }
#chat .mes .mes_buttons { opacity: 0.9; }
#completion_prompt_manager :is(.prompt-manager-inspect-action, .prompt-manager-edit-action, .prompt-manager-detach-action, .prompt-manager-toggle-action) { color: var(--SmartThemeQuoteColor); }`,
    popupBtns: `
.popup .popup-controls :is(.popup-button-ok, .popup-button-cancel, .popup-button-custom, .menu_button) { background-image: none; background-color: transparent; border: 1px solid var(--SmartThemeBorderColor); border-radius: 2px; color: var(--SmartThemeBodyColor); }
.popup .popup-controls .popup-button-ok { background-color: var(--SmartThemeQuoteColor); border-color: var(--SmartThemeQuoteColor); color: var(--SmartThemeBlurTintColor); }`,
    noGrey: `
${PM_DIS}, ${PM_DIS} * { opacity: 1 !important; filter: none !important; }
${PM_DIS} :is(.completion_prompt_manager_prompt_name, .completion_prompt_manager_prompt_name a, .prompt_manager_prompt_tokens) { color: var(--SmartThemeBodyColor) !important; text-decoration: none !important; }
${PM_DIS} { outline: 1px dashed color-mix(in srgb, var(--SmartThemeBodyColor) 45%, transparent); outline-offset: -3px; }`,
    noGreyPopup: `
#completion_prompt_manager_popup, #completion_prompt_manager_popup * { opacity: 1 !important; filter: none !important; }
#completion_prompt_manager_popup :is(:disabled, [disabled], .disabled) { color: var(--SmartThemeBodyColor) !important; -webkit-text-fill-color: var(--SmartThemeBodyColor); }`,
    tight: `
#completion_prompt_manager #completion_prompt_manager_list li.completion_prompt_manager_prompt { padding-block: 1px; min-height: 0; line-height: 1.3; }`,
    noScroll: `
* { scrollbar-width: none; }
*::-webkit-scrollbar { width: 0 !important; height: 0 !important; background: transparent; }`,
    safeArea: `
#top-bar { padding-top: env(safe-area-inset-top); }
#form_sheld { padding-bottom: env(safe-area-inset-bottom); }`,
    lowPower: `
*, *::before, *::after { animation-duration: 0s !important; animation-iteration-count: 1 !important; transition: none !important; backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }`,
};

function shapeCss(sel, shape) {
    if (shape === 'theme') return '';
    const r = { circle: '50%', square: '0', rounded: '22%', arch: '50% 50% 0 0 / 40% 40% 0 0', hex: '0' }[shape];
    let css = `${sel} .avatar, ${sel} .avatar img { border-radius: ${r}; }`;
    if (shape === 'hex') css += `\n${sel} .avatar img { clip-path: polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%); }`;
    return css;
}

function sizeCss(sel, n) {
    if (!n) return '';
    return `${sel} { --avatar-base-width: ${n}px; --avatar-base-height: ${n}px; }
${sel} .avatar, ${sel} .avatar img { width: ${n}px; height: ${n}px; min-width: ${n}px; max-width: none; }`;
}

function layoutCss(sel, lay, n, isUser) {
    const just = { topl: 'flex-start', topc: 'center', topr: 'flex-end' }[lay];
    switch (lay) {
        case 'left': return `${sel} { flex-direction: row; }`;
        case 'right': return `${sel} { flex-direction: row-reverse; }\n${sel} .mes_block { text-align: start; }`;
        case 'topl': case 'topc': case 'topr': return `
${sel} { flex-direction: column; align-items: stretch; }
${sel} .mesAvatarWrapper { position: static; flex-direction: row; align-items: center; justify-content: ${just}; width: 100%; gap: 8px; }
${sel} .mes_block { width: 100%; padding-inline: 0; padding-top: 0; margin-inline: 0; }`;
        case 'bigTop': case 'bigCenter': case 'bigSide': return bigCss(sel, lay);
        case 'corner': { const s = n || 56; const side = isUser ? 'right' : 'left'; return `
${sel} { position: relative; }
${sel} .mesAvatarWrapper { position: absolute; top: -6px; ${side}: -6px; z-index: 3; }
${sel} .mes_block { padding-${side}: ${Math.round(s * 0.55 + 8)}px; padding-top: ${Math.round(s * 0.35)}px; }`; }
        case 'none': return `${sel} .mesAvatarWrapper .avatar { display: none; }`;
        default: return '';
    }
}


const BIG = new Set(['bigTop', 'bigCenter', 'bigSide']);
function isPortraitPhone() { return W.matchMedia('(max-width: 768px) and (orientation: portrait)').matches; }
function effLay(isUser) {
    const a = S().avatar;
    if (!isUser && a.mobileBig && isPortraitPhone() && !BIG.has(a.layC)) return 'bigTop';
    return isUser ? a.layU : a.layC;
}

function bigCss(sel, lay) {
    const a = S().avatar; const h = a.bigH || 100; const pos = a.bigPos ?? 20;
    const fadeV = a.bigFade ? '-webkit-mask-image: linear-gradient(#000 55%, transparent); mask-image: linear-gradient(#000 55%, transparent);' : '';
    const fadeH = a.bigFade ? '-webkit-mask-image: linear-gradient(90deg, #000 60%, transparent); mask-image: linear-gradient(90deg, #000 60%, transparent);' : '';
    const common = `
${sel} .mesAvatarWrapper { display: none; }
${sel} .mes_block { position: relative; z-index: 0; isolation: isolate; min-width: 0; }
${sel} .ltm-bigpic { pointer-events: none; overflow: hidden; z-index: -1; }
${sel} .ltm-bigpic img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center ${pos}%; max-width: none; border-radius: 0; }`;
    if (lay === 'bigTop') return common + `
${sel} .ltm-bigpic { position: relative; width: 100%; aspect-ratio: 100 / ${h}; margin-bottom: -48px; border-radius: inherit; }
${sel} .ltm-bigpic img { ${fadeV} }`;
    if (lay === 'bigCenter') return common + `
${sel} .ltm-bigpic { position: relative; width: 68%; margin: 6px auto -40px; aspect-ratio: 75 / ${h}; }
${sel} .ltm-bigpic img { ${fadeV} }
${sel} .ch_name { justify-content: center; text-align: center; }`;
    return common + `
${sel} .mes_block { padding-left: calc(36% - 12px); min-height: ${Math.round(2.2 * h)}px; }
${sel} .ltm-bigpic { position: absolute; left: 0; top: 0; bottom: 0; width: 36%; }
${sel} .ltm-bigpic img { ${fadeH} }`;
}

function fullSrc(src) {
    if (!S().avatar.fullRes) return src;
    try {
        const u = new URL(src, W.location.href);
        if (!/\/thumbnail$/.test(u.pathname)) return src;
        const file = u.searchParams.get('file'); const type = u.searchParams.get('type');
        if (!file) return src;
        if (type === 'avatar') return '/characters/' + encodeURIComponent(file);
        if (type === 'persona') return '/User Avatars/' + encodeURIComponent(file);
    } catch { /* 保持原图 */ }
    return src;
}

function decorateMessages() {
    D.querySelectorAll('#chat .mes').forEach(mes => {
        const isUser = mes.getAttribute('is_user') === 'true';
        const block = mes.querySelector('.mes_block'); if (!block) return;
        let pic = block.querySelector(':scope > .ltm-bigpic');
        if (!BIG.has(effLay(isUser))) { pic?.remove(); return; }
        const src = mes.querySelector('.avatar img')?.getAttribute('src'); if (!src) return;
        const want = fullSrc(src);
        if (!pic) { pic = D.createElement('div'); pic.className = 'ltm-bigpic'; pic.innerHTML = '<img alt="">'; block.prepend(pic); }
        const img = pic.querySelector('img');
        if (img.getAttribute('src') !== want) { img.onerror = () => { if (img.getAttribute('src') !== src) img.setAttribute('src', src); }; img.setAttribute('src', want); }
    });
}

/* ---- 上传的字体文件（存在酒馆服务器 user/files 里） ---- */
const FONT_FILE = /\.(ttf|otf|woff2?)(\?|#|$)/i;
function upFonts() { if (!Array.isArray(S().fonts)) S().fonts = []; return S().fonts; }
function fontInfo(key) {
    if (String(key).startsWith('up:')) {
        const f = upFonts().find(x => 'up:' + x.id === key);
        return f ? { label: f.name, family: `"${f.family}"` } : null;
    }
    return FONTS[key];
}
function fontChoices(withEn) {
    const base = Object.entries(FONTS).filter(([k, f]) => k !== 'custom' && (withEn || !f.en)).map(([k, f]) => [k, f.label, '']);
    return [...base, ...upFonts().map(f => ['up:' + f.id, f.name, '']), ['custom', FONTS.custom.label, '']];
}

// 自定义链接：认得字体文件链接和 Google Fonts 的网页链接
function customFontSource() {
    const f = S().font; let url = (f.customUrl || '').trim(); let family = (f.customFamily || '').trim();
    if (!url) return null;
    const spec = url.match(/fonts\.google\.com\/specimen\/([^/?#]+)/);
    if (spec) url = `https://fonts.googleapis.com/css2?family=${spec[1]}&display=swap`;
    if (!family) {
        const m = url.match(/[?&]family=([^:&;]+)/);
        if (m) family = decodeURIComponent(m[1].replace(/\+/g, ' '));
        else if (FONT_FILE.test(url)) family = 'LTM Custom';
    }
    return { url, family, isFile: FONT_FILE.test(url) };
}

function fontFaceCss() {
    const out = upFonts().map(f => `@font-face { font-family: "${f.family}"; src: url("${f.url}"); font-display: swap; }`);
    const c = customFontSource();
    if (c?.isFile && c.family) out.push(`@font-face { font-family: "${c.family.replace(/"/g, '')}"; src: url("${c.url}"); font-display: swap; }`);
    return out.join('\n');
}

function b64(buf) {
    const bytes = new Uint8Array(buf); let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
}

async function uploadFonts(files) {
    let last = null;
    for (const f of files) {
        if (!FONT_FILE.test(f.name)) { toastr.warning(`${f.name} 不是字体文件。`, '美化器'); continue; }
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        const ext = f.name.match(FONT_FILE)[1].toLowerCase();
        const fileName = `ltm-font-${id}.${ext}`;
        const label = f.name.replace(FONT_FILE, '').slice(0, 30) || '我的字体';
        toastr.info(`正在上传「${label}」……`, '美化器');
        try {
            const r = await fetch('/api/files/upload', {
                method: 'POST', headers: ctx().getRequestHeaders(),
                body: JSON.stringify({ name: fileName, data: b64(await f.arrayBuffer()) }),
            });
            if (!r.ok) throw new Error(r.status);
            const { path } = await r.json();
            upFonts().push({ id, name: label, family: `LTM ${id}`, url: '/' + String(path).replace(/^\/+/, ''), path });
            last = 'up:' + id;
            toastr.success(`「${label}」上传好了。`, '美化器');
        } catch (e) {
            toastr.error(`「${label}」上传失败（${e.message}）。文件太大时可以先转成 woff2 再传。`, '美化器');
        }
    }
    if (last && S().font.body === 'theme') S().font.body = last; // 刚传的字体直接用上
    save(); $('#love-tm').remove(); mountPanel(); applyAll();
}

async function deleteFont(id) {
    const f = upFonts().find(x => x.id === id); if (!f) return;
    if (!confirm(`删除字体「${f.name}」？`)) return;
    S().fonts = upFonts().filter(x => x.id !== id);
    for (const k of ['body', 'name']) if (S().font[k] === 'up:' + id) S().font[k] = 'theme';
    save(); $('#love-tm').remove(); mountPanel(); applyAll();
    try { await fetch('/api/files/delete', { method: 'POST', headers: ctx().getRequestHeaders(), body: JSON.stringify({ path: f.path }) }); } catch { /* 文件留在服务器上也没关系 */ }
}

function fontFamily(key) {
    if (key === 'custom') { const c = customFontSource(); return c?.family ? `"${c.family.replace(/"/g, '')}"` : ''; }
    return fontInfo(key)?.family || '';
}

function loadFontLink(key) {
    if (String(key).startsWith('up:')) return;
    const c = key === 'custom' ? customFontSource() : null;
    if (c?.isFile) return;
    const url = key === 'custom' ? c?.url : FONTS[key]?.url;
    if (!url || document.querySelector(`link[data-ltm-font="${key}"][href="${CSS.escape(url)}"]`)) return;
    document.querySelectorAll(`link[data-ltm-font="${key}"]`).forEach(l => l.remove());
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = url; l.dataset.ltmFont = key;
    document.head.appendChild(l);
}

const FALLBACK = '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif';
function fallbackCss() {
    const out = [];
    for (const [sel, q] of [['body', 'body'], ['#chat .mes .mes_text', '#chat .mes .mes_text']]) {
        const el = document.querySelector(q); if (!el) continue;
        const ff = getComputedStyle(el).fontFamily;
        if (!ff || /(sans-serif|serif|monospace|cursive|fantasy|system-ui)\s*$/i.test(ff)) continue;
        out.push(`${sel} { font-family: ${ff}, ${FALLBACK}; }`);
    }
    return out.join('\n');
}

function buildCss() {
    const s = S(); const parts = [];
    if (s.activeCss) { const t = findTheme(s.activeCss); if (t?.css) parts.push(`/* 导入的 CSS 主题：${t.name} */\n${t.css}`); }
    for (const [k, css] of Object.entries(FIX_CSS)) if (s.fixes[k]) parts.push(css);
    if (pickedColor) parts.push(`:root { --SmartThemeQuoteColor: ${pickedColor} !important; --SmartThemeEmColor: ${pickedColor} !important; }`);

    const f = s.font;
    const body = f.body !== 'theme' ? fontFamily(f.body) : '';
    const tgt = '#chat .mes .mes_text, #chat .mes .mes_text :is(p, span, q, em, strong, li, div, blockquote, font, summary)';
    if (body) {
        parts.push(`${tgt} { font-family: ${body}, ${FALLBACK}; }`);
        if (!f.onlyBody) parts.push(`:root { --mainFontFamily: ${body}, ${FALLBACK} !important; } body { font-family: ${body}, ${FALLBACK}; }`);
    }
    if (f.size) parts.push(`#chat .mes .mes_text { font-size: ${f.size}px; }`);
    if (f.pg !== null && f.pg !== undefined) parts.push(`#chat .mes .mes_text p { margin-top: 0; margin-bottom: ${f.pg}em; }`);
    if (f.lh) parts.push(`#chat .mes .mes_text, #chat .mes .mes_text p { line-height: ${f.lh}; }`);
    if (f.ls !== null && f.ls !== undefined) parts.push(`#chat .mes .mes_text { letter-spacing: ${f.ls}em; }`);
    if (f.name !== 'theme' && fontFamily(f.name)) parts.push(`#chat .mes .name_text { font-family: ${fontFamily(f.name)}, ${FALLBACK}; }`);

    const a = s.avatar;
    const C = '#chat .mes[is_user="false"]', U = '#chat .mes[is_user="true"]';
    parts.push(shapeCss(C, a.shapeC), shapeCss(U, a.shapeU), sizeCss(C, a.sizeC), sizeCss(U, a.sizeU),
        layoutCss(C, effLay(false), a.sizeC, false), layoutCss(U, effLay(true), a.sizeU, true));
    return parts.filter(Boolean).join('\n');
}

let styleEl, fbEl;
function applyAll() {
    const s = S();
    if (s.font.body !== 'theme') loadFontLink(s.font.body);
    if (s.font.name !== 'theme') loadFontLink(s.font.name);

    let ff = document.getElementById('love-tm-fontfaces');
    if (!ff) { ff = document.createElement('style'); ff.id = 'love-tm-fontfaces'; document.head.appendChild(ff); }
    const faces = fontFaceCss(); if (ff.textContent !== faces) ff.textContent = faces;

    if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'love-tm-layer'; }
    if (!fbEl) { fbEl = document.createElement('style'); fbEl.id = 'love-tm-fallback'; }
    styleEl.textContent = buildCss();
    document.body.appendChild(styleEl); // 放在最后，保证排在主题 custom css 之后
    fbEl.textContent = '';
    if (s.fixes.fontFallback) requestAnimationFrame(() => { fbEl.textContent = fallbackCss(); document.body.appendChild(fbEl); });

    if (s.fixes.compact) {
        const cb = $('#compact_input_area');
        if (cb.length && !cb.prop('checked')) cb.prop('checked', true).trigger('input').trigger('change');
    }
    setViewport();
    applyPlaceholder();
    decorateMessages();
}

function setViewport() {
    const m = document.querySelector('meta[name="viewport"]'); if (!m) return;
    let c = m.content.split(',').map(x => x.trim()).filter(x => !/^(interactive-widget|viewport-fit)=/.test(x));
    if (S().fixes.keyboard) c.push('interactive-widget=resizes-content');
    if (S().fixes.safeArea) c.push('viewport-fit=cover');
    m.content = c.join(', ');
}

let phOriginal = null;
function wantedPlaceholder() {
    if (!S().fixes.placeholder) return null;
    const t = allThemes().find(isActive);
    const own = t && (S().themes.find(x => x.overrideOf === t.id)?.placeholder ?? t.placeholder);
    return own || S().placeholderFallback || null;
}
function applyPlaceholder() {
    const ta = document.getElementById('send_textarea'); if (!ta) return;
    if (phOriginal === null) phOriginal = ta.getAttribute('placeholder') || '';
    const w = wantedPlaceholder();
    const target = w ?? phOriginal;
    if (ta.getAttribute('placeholder') !== target) ta.setAttribute('placeholder', target);
}

/* ---------------- 检查当前页面 ---------------- */

function scanPage() {
    const found = [];
    const chat = document.getElementById('chat');
    if (chat) {
        const cw = chat.clientWidth;
        const wide = [...chat.querySelectorAll('.mes')].filter(m => m.scrollWidth > cw + 2 || m.querySelector('.mes_text')?.scrollWidth > m.clientWidth + 2).length;
        if (wide) found.push(['noOverflow', `${wide} 层楼超出了屏幕宽度`]);
        const off = [...chat.querySelectorAll('.mes .mes_text')].filter(t => {
            const r = t.getBoundingClientRect(), pr = t.closest('.mes').getBoundingClientRect();
            return r.width < pr.width * 0.75 && Math.abs((r.left - pr.left) - (pr.right - r.right)) > pr.width * 0.2;
        }).length;
        if (off) found.push(['center', `${off} 层楼的正文没有居中`]);
        const stretched = [...chat.querySelectorAll('.mes .avatar img')].filter(i => {
            if (!i.naturalWidth || getComputedStyle(i).objectFit !== 'fill') return false;
            return Math.abs(i.naturalWidth / i.naturalHeight - i.clientWidth / i.clientHeight) > 0.08;
        }).length;
        if (stretched) found.push(['avatarFit', `${stretched} 个头像被拉伸了`]);
    }
    const grey = [...document.querySelectorAll('#completion_prompt_manager_list li.completion_prompt_manager_prompt_disabled')].filter(li => {
        const n = li.querySelector('.completion_prompt_manager_prompt_name') || li;
        let o = 1, e = n; while (e && e !== li.parentElement) { o *= +getComputedStyle(e).opacity; e = e.parentElement; }
        return o < 0.95;
    }).length;
    if (grey) found.push(['noGrey', `预设列表里有 ${grey} 个禁用条目是灰的`]);
    const grad = [...document.querySelectorAll('#extensions_settings .inline-drawer-header, #extensions_settings2 .inline-drawer-header')].filter(h => /gradient/.test(getComputedStyle(h).backgroundImage)).length;
    if (grad) found.push(['drawerHead', `${grad} 个扩展标题条还是默认渐变`]);
    const sh = [...document.querySelectorAll('.standoutHeader, #user-settings-block h4')].filter(h => /gradient/.test(getComputedStyle(h).backgroundImage)).length;
    if (sh) found.push(['headers', `${sh} 个设置页小标题还是默认样式`]);
    const ta = document.getElementById('send_textarea');
    if (ta && phOriginal !== null && ta.getAttribute('placeholder') === phOriginal && phOriginal) found.push(['placeholder', '输入框还是默认占位符']);
    if ($('#compact_input_area').length && !$('#compact_input_area').prop('checked')) found.push(['compact', '紧凑输入区没有打开']);
    const sb = (chat && chat.offsetWidth - chat.clientWidth > 2);
    if (sb) found.push(['noScroll', '聊天区有可见的滚动条']);
    return found;
}

function runScan() {
    const box = $('#ltm-scan');
    const found = scanPage();
    if (!found.length) { box.html('<div class="ltm-scan-ok">没有发现问题。</div>'); return; }
    box.html(found.map(([k, msg]) => `<div class="ltm-scan-row"><span>${msg}</span>${S().fixes[k]
        ? '<em>已开启，但主题的写法更强，没能盖过去</em>'
        : `<button class="ltm-btn2" data-fix="${k}">修正</button>`}</div>`).join(''));
    box.find('[data-fix]').on('click', function () { const k = this.dataset.fix; S().fixes[k] = true; save(); applyAll(); renderFixes(); runScan(); });
}

/* ---------------- 面板 ---------------- */

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function group(key, no, title, body, count = '') {
    const open = S().open[key] ? ' open' : '';
    return `<details class="ltm-grp" data-key="${key}"${open}><summary><span class="ltm-no">${no}</span><span class="ltm-gt">${title}</span><span class="ltm-cnt" data-cnt="${key}">${count}</span><i class="ltm-arr fa-solid fa-chevron-down"></i></summary><div class="ltm-gb">${body}</div></details>`;
}

function toggle(path, title, desc) {
    return `<label class="ltm-it"><input type="checkbox" data-path="${path}"${getPath(path) ? ' checked' : ''}><span class="ltm-hole"></span><span class="ltm-txt"><span class="ltm-t">${title}</span>${desc ? `<span class="ltm-d">${desc}</span>` : ''}</span></label>`;
}

function opts(path, list, cls = '') {
    const v = getPath(path);
    return `<div class="ltm-opts ${cls}" data-path="${path}">${list.map(([k, label, extra]) => `<button type="button" class="ltm-op${v === k ? ' sel' : ''}" data-v="${k}">${extra ?? ''}${label}</button>`).join('')}</div>`;
}

function plainSlider(path, label, min, max, step, unit) {
    const v = getPath(path);
    return `<div class="ltm-sl"><span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${v}" data-path="${path}" data-unit="${unit}"><b>${v}${unit}</b></div>`;
}

function slider(path, label, min, max, step, unit, follow = 0) {
    const v = getPath(path);
    const isFollow = v === follow || v === null || v === undefined;
    const shown = isFollow ? '跟随' : `${v}${unit}`;
    const val = isFollow ? min : v;
    return `<div class="ltm-sl"><span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${val}" data-path="${path}" data-unit="${unit}"><b>${shown}</b><button type="button" class="ltm-reset" data-reset="${path}" data-follow="${follow === null ? 'null' : follow}" title="跟随主题">↺</button></div>`;
}

function panelHtml() {
    return `
<div id="love-tm" class="inline-drawer">
  <div class="inline-drawer-toggle inline-drawer-header"><b>if love · 主题美化器</b><div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div></div>
  <div class="inline-drawer-content">
    <div class="ltm-wrap ltm-ui">
      <div class="ltm-head"><span class="ltm-logo">if <em>love</em></span><span class="ltm-lab">主题美化器</span></div>
      ${group('themes', '主', '主题', `<div id="ltm-themes"></div>
        <div class="ltm-row"><button type="button" class="ltm-btn" id="ltm-import">导入主题</button><button type="button" class="ltm-btn2" id="ltm-undo">撤销上一次切换</button></div>
        <input type="file" id="ltm-file" accept=".json,.css" multiple hidden>
        <div class="ltm-sub">支持酒馆主题 JSON 和单独的 .css 文件。CSS 主题会叠加在当前主题上，再点一次就取下。</div>`)}
      ${group('auto', '自', '自动', autoHtml())}
      ${FIXES.map((g, i) => group('fix_' + g.group, String(i + 1).padStart(2, '0'), g.title,
        g.items.map(([k, t, d]) => toggle('fixes.' + k, t, d)).join('') + (g.group === 'input' ? `<div class="ltm-field"><span>默认占位句</span><input type="text" data-text="placeholderFallback" value="${esc(S().placeholderFallback)}" placeholder="主题没有自带时用这句"></div>` : ''),
        '')).join('')}
      ${group('font', '06', '字体', fontHtml())}
      ${group('avatar', '07', '头像', avatarHtml())}
      <div class="ltm-row ltm-foot">
        <button type="button" class="ltm-btn" id="ltm-scan-btn">检查当前页面</button>
        <button type="button" class="ltm-btn2" id="ltm-all">全部开启</button>
        <button type="button" class="ltm-btn2" id="ltm-default">恢复默认</button>
      </div>
      <div id="ltm-scan"></div>
    </div>
  </div>
</div>`;
}

function autoHtml() {
    return `${toggle('auto.dayNight', '日夜切换', '白天和夜晚各用一个主题。和十二时辰二选一。')}
<details class="ltm-inner"><summary>设置白天和夜晚</summary><div id="ltm-dn"></div></details>
${toggle('auto.time', '按时间切换（十二时辰）', '到了某个时辰，自动换成下面设好的主题。')}
<details class="ltm-inner"><summary>设置每个时辰的主题</summary><div id="ltm-slots"></div></details>
${toggle('auto.char', '按角色卡切换', '打开某个角色的聊天时，自动换成绑定的主题。')}
<div class="ltm-row"><button type="button" class="ltm-btn2" id="ltm-bind">当前角色绑定当前主题</button></div>
<div id="ltm-binds"></div>
<div class="ltm-lab2">随机主题</div>${opts('auto.random', RANDOM_OPTS, 'ltm-chips')}
<div class="ltm-sub">开了日夜或十二时辰时，随机不生效。</div>
<div class="ltm-row"><button type="button" class="ltm-btn2" id="ltm-rand">随机换一个</button></div>
${toggle('auto.pickColor', '从背景图取色', '取背景图的主色，替换强调色和引号色。关掉就恢复主题原色。')}`;
}

function fontHtml() {
    const all = fontChoices(true);
    const list = fontChoices(false);
    const ups = upFonts();
    return `<div class="ltm-lab2">正文字体</div>${opts('font.body', list, 'ltm-fontopts')}
<div class="ltm-custom" ${S().font.body === 'custom' || S().font.name === 'custom' ? '' : 'hidden'}>
  <div class="ltm-field"><span>字体链接</span><input type="text" data-text="font.customUrl" value="${esc(S().font.customUrl)}" placeholder="CSS 链接或 .ttf / .woff2 文件链接"></div>
  <div class="ltm-field"><span>字体名称</span><input type="text" data-text="font.customFamily" value="${esc(S().font.customFamily)}" placeholder="不知道可以不填"></div>
  <div class="ltm-sub">Google Fonts 的网页链接也能直接粘贴，名字会自动认出来。</div>
</div>
<div class="ltm-lab2">我的字体</div>
<div class="ltm-myfonts">${ups.map(f => `<span class="ltm-fchip" style="font-family:'${f.family}'">${esc(f.name)}<button type="button" data-fdel="${f.id}" title="删除">×</button></span>`).join('')}<button type="button" class="ltm-btn2" id="ltm-fup">＋ 上传字体文件</button></div>
<input type="file" id="ltm-ffile" accept=".ttf,.otf,.woff,.woff2" multiple hidden>
<div class="ltm-sub">支持 ttf、otf、woff、woff2。字体存在酒馆服务器上，换手机、换电脑都能用。中文字体文件比较大，上传要等一会。</div>
<div class="ltm-lab2">大小与间距</div>
${slider('font.size', '字号', 12, 22, 1, 'px', 0)}
${slider('font.lh', '行距', 1.3, 2.6, 0.1, '', 0)}
${slider('font.ls', '字距', 0, 0.3, 0.02, 'em', null)}
${slider('font.pg', '段距', 0, 1.6, 0.1, 'em', null)}
${toggle('font.onlyBody', '只改正文，界面文字不变', '')}
<div class="ltm-lab2">名字字体</div>${opts('font.name', all, 'ltm-fontopts')}`;
}

function layoutOpts(path) {
    const v = getPath(path);
    return `<div class="ltm-opts ltm-lays" data-path="${path}">${LAYOUTS.map(([k, label, th]) => `<button type="button" class="ltm-op${v === k ? ' sel' : ''}" data-v="${k}"><span class="ltm-th">${th}</span>${label}</button>`).join('')}</div>`;
}

function avatarHtml() {
    const sh = SHAPES.map(([k, l, st]) => [k, l, k === 'theme' ? '' : `<i class="ltm-shape" style="${st}"></i>`]);
    return `<div class="ltm-lab2">常用组合</div>
<div class="ltm-opts ltm-presets">${PRESETS.map(([t, d], i) => `<button type="button" class="ltm-op" data-preset="${i}">${t}<small>${d}</small></button>`).join('')}</div>
<div class="ltm-side"><div class="ltm-side-t">角色楼层</div>
  <div class="ltm-lab2">布局</div>${layoutOpts('avatar.layC')}
  <div class="ltm-lab2">形状</div>${opts('avatar.shapeC', sh)}
  ${slider('avatar.sizeC', '大小', 32, 240, 2, 'px', 0)}
</div>
<div class="ltm-side"><div class="ltm-side-t">我的楼层</div>
  <div class="ltm-lab2">布局</div>${layoutOpts('avatar.layU')}
  <div class="ltm-lab2">形状</div>${opts('avatar.shapeU', sh)}
  ${slider('avatar.sizeU', '大小', 32, 240, 2, 'px', 0)}
</div>
<div class="ltm-side"><div class="ltm-side-t">大头像</div>
  <div class="ltm-sub" style="margin-top:2px">选了「大头像」布局时用这里的设置，形状和大小不起作用。</div>
  ${plainSlider('avatar.bigH', '图片高度', 40, 160, 5, '%')}
  ${plainSlider('avatar.bigPos', '显示位置', 0, 100, 5, '%')}
  ${toggle('avatar.bigFade', '边缘渐隐', '图片边缘淡进楼层里。')}
  ${toggle('avatar.fullRes', '用原图', '不用酒馆的小缩略图，放大不会糊。')}
</div>
${toggle('avatar.mobileBig', '手机竖屏时角色自动用大头像', '竖屏时角色楼层自动用「卡片顶图」。')}`;
}

function renderThemes() {
    const box = $('#ltm-themes'); if (!box.length) return;
    const list = allThemes();
    if (!list.length) { box.html('<div class="ltm-empty">还没有主题。点下面的「导入主题」添加。</div>'); return; }
    const series = [...new Set(list.map(t => t.series || '未分组'))];
    box.html(series.map(se => `<div class="ltm-series">${esc(se)}</div><div class="ltm-cards">${list.filter(t => (t.series || '未分组') === se).map(t => {
        const ov = S().themes.find(x => x.overrideOf === t.id) || {};
        const desc = ov.desc ?? t.desc; const cover = ov.cover ? { ...t, cover: ov.cover } : t;
        const ph = ov.placeholder ?? t.placeholder;
        const mine = bgsOf(t); const main = bgMainOf(t); const mode = tval(t, 'bgMode') === 'random' ? 'random' : 'main';
        const lib = bgList(); mine.forEach(b => { if (!lib.includes(b)) lib.unshift(b); });
        const act = isActive(t);
        return `<div class="ltm-card${act ? ' act' : ''}${openMore === t.id ? ' open' : ''}" data-id="${t.id}">
  ${act ? '<span class="ltm-badge">使用中</span>' : ''}
  <div class="ltm-cover" style="${coverOf(cover)}"></div>
  <div class="ltm-name">${esc(themeName(t))}</div>
  <div class="ltm-desc" data-edit="desc" title="点一下编辑简介">${desc ? esc(desc) : '<span class="ltm-ph">没有简介，点这里写一句</span>'}</div>
  <div class="ltm-cardfoot"><span class="ltm-kind">${t.builtin ? 'if love' : (t.kind === 'css' ? 'CSS' : '导入')}</span>
    <span class="ltm-acts"><button type="button" data-act="more" title="更多">⋯</button><button type="button" class="ltm-hole ltm-use${act ? ' on' : ''}" data-act="use" title="使用"></button></span></div>
  <div class="ltm-more"${openMore === t.id ? '' : ' hidden'}>
    <div class="ltm-lab2">背景${mine.length ? ` · ${mine.length} 张` : ''}</div>
    <div class="ltm-thumbs">${mine.map(bg => `<div class="ltm-bt${bg === main ? ' main' : ''}" data-bgmain="${esc(bg)}" title="${esc(bg)}" style="background-image:url('${bgThumb(bg)}')">${bg === main && mine.length > 1 ? '<span class="ltm-bm">主</span>' : ''}<span class="ltm-bx" data-bgdel="${esc(bg)}" title="取消绑定">×</span></div>`).join('')}<button type="button" class="ltm-badd${openPick === t.id ? ' on' : ''}" data-act="bgpick" title="从背景库选">+</button></div>
    ${mine.length > 1 ? `<div class="ltm-chips ltm-bgmode"><button type="button" class="ltm-op${mode === 'main' ? ' sel' : ''}" data-bgmode="main">用主背景</button><button type="button" class="ltm-op${mode === 'random' ? ' sel' : ''}" data-bgmode="random">随机一张</button></div>` : ''}
    ${openPick === t.id ? `<div class="ltm-picker">${lib.length ? lib.map(bg => `<div class="ltm-pk${mine.includes(bg) ? ' on' : ''}" data-pick="${esc(bg)}" title="${esc(bg)}" style="background-image:url('${bgThumb(bg)}')"></div>`).join('') : '<div class="ltm-sub">酒馆背景库里还没有图。</div>'}</div>
    <div class="ltm-row" style="margin-top:6px"><button type="button" class="ltm-btn2" data-act="bgnow">绑定当前背景</button></div>` : ''}
    <details class="ltm-inner ltm-moreinfo"><summary>分组和占位句</summary>
      <div class="ltm-field"><span>分组</span><input type="text" data-tedit="series" value="${esc(ov.series ?? t.series ?? '')}"></div>
      <div class="ltm-field"><span>占位句</span><input type="text" data-tedit="placeholder" value="${esc(ph ?? '')}" placeholder="输入框里显示的句子"></div>
    </details>
    <div class="ltm-row ltm-mini"><button type="button" class="ltm-btn2" data-act="cover">换封面</button>${t.builtin ? '' : '<button type="button" class="ltm-btn2" data-act="del">删除</button>'}</div>
  </div>
</div>`; }).join('')}</div>`).join(''));
}

function renderSlots() {
    const box = $('#ltm-slots'); if (!box.length) return;
    const list = allThemes(); const now = slotNow();
    box.html(SLOTS.map(([k, n, h]) => `<div class="ltm-slot${k === now ? ' now' : ''}"><span>${n}<small>${h}</small></span><select data-slot="${k}"><option value="">不切换</option>${list.map(t => `<option value="${t.id}"${S().auto.slots[k] === t.id ? ' selected' : ''}>${esc(themeName(t))}</option>`).join('')}</select></div>`).join(''));
}

function renderDayNight() {
    const box = $('#ltm-dn'); if (!box.length) return;
    const a = S().auto; const list = jsonThemes();
    const sel = (k) => `<select data-dn="${k}"><option value="">不切换</option>${list.map(t => `<option value="${t.id}"${a[k] === t.id ? ' selected' : ''}>${esc(themeName(t))}</option>`).join('')}</select>`;
    const hr = (k) => `<input type="number" min="0" max="23" step="1" value="${a[k]}" data-dnh="${k}">`;
    box.html(`<div class="ltm-slot"><span>白天</span>${sel('day')}</div>
<div class="ltm-slot"><span>夜晚</span>${sel('night')}</div>
<div class="ltm-slot ltm-hours"><span>白天从</span>${hr('dayStart')}<span>点到</span>${hr('nightStart')}<span>点</span></div>`);
}

function renderBinds() {
    const box = $('#ltm-binds'); if (!box.length) return;
    const m = S().auto.charMap; const ks = Object.keys(m);
    box.html(ks.length ? ks.map(k => `<div class="ltm-bind"><span>${esc(m[k].name)} → ${esc(themeName(findTheme(m[k].id) || { name: '（主题已删除）', kind: 'css' }))}</span><button type="button" data-unbind="${esc(k)}">×</button></div>`).join('') : '<div class="ltm-sub">还没有绑定。</div>');
}

function renderFixes() {
    $('#love-tm input[type=checkbox][data-path^="fixes."]').each(function () { this.checked = !!getPath(this.dataset.path); });
    updateCounts();
}

function updateCounts() {
    FIXES.forEach(g => {
        const on = g.items.filter(([k]) => S().fixes[k]).length;
        $(`#love-tm [data-cnt="fix_${g.group}"]`).text(`${on} / ${g.items.length}`);
    });
    const f = S().font; $('#love-tm [data-cnt="font"]').text(f.body === 'theme' && !f.size && !f.lh && f.ls === null ? '跟随主题' : '已调整');
    const a = S().avatar; $('#love-tm [data-cnt="avatar"]').text(['shapeC', 'shapeU', 'layC', 'layU'].every(k => a[k] === 'theme') && !a.sizeC && !a.sizeU ? '跟随主题' : '已调整');
    const t = allThemes().find(x => x.kind === 'json' && isActive(x)); $('#love-tm [data-cnt="themes"]').text(t ? themeName(t) : '');
}

function bindControls(root) {
    root.on('change', 'input[type=checkbox][data-path]', function () {
        const p = this.dataset.path;
        setPath(p, this.checked);
        if (this.checked && p === 'auto.time') { S().auto.dayNight = false; $('input[data-path="auto.dayNight"]').prop('checked', false); }
        if (this.checked && p === 'auto.dayNight') { S().auto.time = false; $('input[data-path="auto.time"]').prop('checked', false); }
        if (p === 'auto.pickColor') pickColor(); else applyAll();
        if (p === 'auto.time' || p === 'auto.dayNight') autoTime(true);
        if (p === 'auto.char') autoChar();
        save(); updateCounts();
    });

    root.on('click', '.ltm-opts[data-path] .ltm-op', function () {
        const box = $(this).closest('.ltm-opts'); box.find('.ltm-op').removeClass('sel'); $(this).addClass('sel');
        const p = box.data('path');
        setPath(p, this.dataset.v);
        if (p === 'auto.random' && this.dataset.v === 'day') { S().auto.randDay = ''; save(); autoRandom(); }
        $('#love-tm .ltm-custom').prop('hidden', !(S().font.body === 'custom' || S().font.name === 'custom'));
        applyAll(); updateCounts();
    });

    root.on('input', 'input[type=range][data-path]', function () {
        const v = +(+this.value).toFixed(2);
        setPath(this.dataset.path, v);
        $(this).next('b').text(`${v}${this.dataset.unit}`);
        applyAll(); updateCounts();
    });
    root.on('click', '[data-reset]', function () {
        const fv = this.dataset.follow === 'null' ? null : +this.dataset.follow;
        setPath(this.dataset.reset, fv); $(this).siblings('b').text('跟随'); applyAll(); updateCounts();
    });
}

function bind() {
    const root = $('#love-tm');
    bindControls(root);
    root.find('details.ltm-grp').on('toggle', function () {
        S().open[this.dataset.key] = this.open; save();
        if (this.open && this.dataset.key === 'font') loadPreviewFonts();
    });

    root.on('click', '[data-preset]', function () {
        const p = PRESETS[+this.dataset.preset][2];
        Object.assign(S().avatar, p); save();
        root.find('.ltm-opts[data-path="avatar.layC"] .ltm-op').each(function () { $(this).toggleClass('sel', this.dataset.v === p.layC); });
        root.find('.ltm-opts[data-path="avatar.layU"] .ltm-op').each(function () { $(this).toggleClass('sel', this.dataset.v === p.layU); });
        applyAll(); updateCounts();
    });

    root.on('change', 'input[data-text]', function () { setPath(this.dataset.text, this.value.trim()); applyAll(); });

    root.on('click', '#ltm-import', () => $('#ltm-file').trigger('click'));
    root.on('change', '#ltm-file', function () { importFiles([...this.files]); this.value = ''; });
    root.on('click', '#ltm-undo', undoTheme);

    root.on('click', '.ltm-card [data-act]', function (e) {
        e.stopPropagation();
        const id = $(this).closest('.ltm-card').data('id'); const act = this.dataset.act;
        if (act === 'use') useTheme(String(id));
        if (act === 'more') { openMore = openMore === String(id) ? null : String(id); if (!openMore) openPick = null; renderThemes(); }
        if (act === 'bgpick') { openPick = openPick === String(id) ? null : String(id); renderThemes(); }
        if (act === 'cover') setCover(String(id));
        if (act === 'bgnow') {
            const b = currentBg(); if (!b) { toastr.info('现在没有背景图。', '美化器'); return; }
            const t = findTheme(String(id)); setBgs(String(id), [...bgsOf(t), b]); renderThemes();
            toastr.success(`已绑定背景「${b.replace(/\.[^.]+$/, '')}」`, '美化器');
        }
        if (act === 'del' && confirm('删除这个主题？酒馆里已经导入的主题文件不会被删。')) removeTheme(String(id));
    });
    root.on('click', '.ltm-desc[data-edit]', function () {
        const card = $(this).closest('.ltm-card'); const id = String(card.data('id'));
        const t = findTheme(id); const ov = S().themes.find(x => x.overrideOf === id) || {};
        const cur = ov.desc ?? t.desc ?? '';
        $(this).replaceWith(`<textarea class="ltm-desc-in" rows="2" placeholder="一句话介绍这个主题">${esc(cur)}</textarea>`);
        card.find('.ltm-desc-in').trigger('focus').on('blur', function () { editTheme(id, 'desc', this.value.trim()); renderThemes(); });
    });
    const cardId = el => String($(el).closest('.ltm-card').data('id'));
    root.on('click', '.ltm-card [data-pick]', function () {
        const id = cardId(this); const t = findTheme(id); const b = this.dataset.pick;
        const list = bgsOf(t); setBgs(id, list.includes(b) ? list.filter(x => x !== b) : [...list, b]); renderThemes();
    });
    root.on('click', '.ltm-card [data-bgdel]', function (e) {
        e.stopPropagation();
        const id = cardId(this); setBgs(id, bgsOf(findTheme(id)).filter(x => x !== this.dataset.bgdel)); renderThemes();
    });
    root.on('click', '.ltm-card [data-bgmain]', function () {
        const id = cardId(this); editTheme(id, 'bgMain', this.dataset.bgmain);
        const t = findTheme(id); if (t && isActive(t)) applyBg(this.dataset.bgmain);
        renderThemes();
    });
    root.on('click', '.ltm-card [data-bgmode]', function () { editTheme(cardId(this), 'bgMode', this.dataset.bgmode); renderThemes(); });
    root.on('change', '.ltm-card input[data-tedit]', function () {
        const id = String($(this).closest('.ltm-card').data('id'));
        editTheme(id, this.dataset.tedit, this.value.trim());
        if (this.dataset.tedit === 'series') renderThemes(); else applyPlaceholder();
    });

    root.on('change', 'select[data-slot]', function () { S().auto.slots[this.dataset.slot] = this.value || undefined; save(); autoTime(); });
    root.on('click', '#ltm-bind', () => {
        const k = charKey(); if (!k) { toastr.info('先打开一个角色的聊天。', '美化器'); return; }
        const t = allThemes().find(x => x.kind === 'json' && isActive(x));
        if (!t) { toastr.info('当前主题不在美化器的主题列表里，先导入它。', '美化器'); return; }
        S().auto.charMap[k.key] = { id: t.id, name: k.name }; save(); renderBinds();
        toastr.success(`「${k.name}」绑定到「${themeName(t)}」`, '美化器');
    });
    root.on('click', '[data-unbind]', function () { delete S().auto.charMap[this.dataset.unbind]; save(); renderBinds(); });

    root.on('change', 'select[data-dn]', function () { S().auto[this.dataset.dn] = this.value; save(); autoTime(true); });
    root.on('change', 'input[data-dnh]', function () { const v = Math.min(23, Math.max(0, Math.round(+this.value || 0))); this.value = v; S().auto[this.dataset.dnh] = v; save(); autoTime(true); });
    root.on('click', '#ltm-rand', () => randomTheme());

    root.on('click', '#ltm-fup', () => $('#ltm-ffile').trigger('click'));
    root.on('change', '#ltm-ffile', function () { const fs = [...this.files]; this.value = ''; if (fs.length) uploadFonts(fs); });
    root.on('click', '[data-fdel]', function () { deleteFont(this.dataset.fdel); });

    root.on('click', '#ltm-scan-btn', runScan);
    root.on('click', '#ltm-all', () => { Object.keys(S().fixes).forEach(k => { S().fixes[k] = true; }); save(); applyAll(); renderFixes(); });
    root.on('click', '#ltm-default', () => {
        const d = defaults(); S().fixes = d.fixes; S().font = d.font; S().avatar = d.avatar; save();
        $('#love-tm').remove(); mountPanel(); applyAll();
    });
}

function loadPreviewFonts() {
    Object.entries(FONTS).forEach(([k, f]) => { if (f.url && k !== 'custom') loadFontLink(k); });
    $('#love-tm .ltm-fontopts .ltm-op').each(function () { const f = fontInfo(this.dataset.v); if (f?.family) this.style.fontFamily = f.family; });
}

function mountPanel() {
    const host = $('#extensions_settings2').length ? $('#extensions_settings2') : $('#extensions_settings');
    host.append(panelHtml());
    renderThemes(); renderSlots(); renderDayNight(); renderBinds(); updateCounts(); bind();
    if (S().open.font) loadPreviewFonts();
}

/* ---------------- 魔棒快捷弹窗 ---------------- */

function quickHtml() {
    const t = allThemes().find(isActive);
    return `<div id="ltm-quick" class="ltm-ui">
  <div class="ltm-q-head"><span class="ltm-logo">if <em>love</em></span><span class="ltm-lab ltm-q-name">${esc(t ? themeName(t) : currentStTheme())}</span><button type="button" class="ltm-q-x" title="关闭">×</button></div>
  <div class="ltm-lab2">主题</div>
  <div class="ltm-row" style="margin-top:0"><button type="button" class="ltm-btn" id="ltm-q-rand">随机换一个</button><button type="button" class="ltm-btn2" id="ltm-q-undo">撤销切换</button></div>
  <div class="ltm-lab2">随机模式</div>${opts('auto.random', RANDOM_OPTS, 'ltm-chips')}
  <div class="ltm-lab2">日夜</div>${toggle('auto.dayNight', '白天和夜晚各用一个主题', '主题和时间在设置面板的「自动」里选。')}
  <div class="ltm-lab2">正文</div>
  ${slider('font.size', '字号', 12, 22, 1, 'px', 0)}
  ${slider('font.lh', '行距', 1.3, 2.6, 0.1, '', 0)}
  ${slider('font.ls', '字距', 0, 0.3, 0.02, 'em', null)}
  ${slider('font.pg', '段距', 0, 1.6, 0.1, 'em', null)}
  ${opts('font.body', [...QUICK_FONTS, ...upFonts().map(f => ['up:' + f.id, f.name, ''])], 'ltm-chips')}
  <div class="ltm-sub">更多字体在扩展设置的美化器面板里。</div>
</div>`;
}

function closeQuick() {
    if (!$('#ltm-quick').length) return;
    $('#ltm-quick').remove();
    $(D).off('pointerdown.ltmq');
    $('#love-tm').remove(); mountPanel(); // 同步面板上的数值
}

function openQuick() {
    $('#extensionsMenu').hide();
    if ($('#ltm-quick').length) { closeQuick(); return; }
    $('body').append(quickHtml());
    const q = $('#ltm-quick');
    bindControls(q);
    q.on('click', '.ltm-q-x', closeQuick);
    q.on('click', '#ltm-q-rand', () => { const t = randomTheme(); if (t) q.find('.ltm-q-name').text(themeName(t)); });
    q.on('click', '#ltm-q-undo', () => { undoTheme(); setTimeout(() => q.find('.ltm-q-name').text(currentStTheme()), 400); });
    loadPreviewFonts();
    q.find('.ltm-chips .ltm-op').each(function () { const f = fontInfo(this.dataset.v); if (f?.family) this.style.fontFamily = f.family; });
    setTimeout(() => $(D).on('pointerdown.ltmq', e => { if (!$(e.target).closest('#ltm-quick, #ltm-wand').length) closeQuick(); }), 0);
}

function mountWand() {
    $('#ltm-wand').remove();
    const menu = $('#extensionsMenu'); if (!menu.length) return;
    menu.append(`<div id="ltm-wand" class="list-group-item flex-container flexGap5 interactable" tabindex="0" title="if love · 快捷调整"><div class="fa-solid fa-heart extensionsMenuExtensionButton"></div><span>if love · 快捷调整</span></div>`);
    $('#ltm-wand').on('click', openQuick);
}

/* ---------------- 启动 ---------------- */

jQuery(async () => {
    S();
    mountPanel();
    mountWand();
    applyAll();

    const c = ctx();
    c.eventSource.on(c.event_types.CHAT_CHANGED, () => { autoChar(); setTimeout(applyAll, 200); });
    if (c.event_types.SETTINGS_UPDATED) c.eventSource.on(c.event_types.SETTINGS_UPDATED, () => setTimeout(applyAll, 50));
    $(document).on('change', '#themes', () => setTimeout(() => { applyAll(); renderThemes(); updateCounts(); }, 300));

    const ta = document.getElementById('send_textarea');
    if (ta) new MutationObserver(() => { const w = wantedPlaceholder(); if (w && ta.getAttribute('placeholder') !== w) ta.setAttribute('placeholder', w); })
        .observe(ta, { attributes: true, attributeFilter: ['placeholder'] });

    const bg = document.getElementById('bg1');
    if (bg) new MutationObserver(() => { if (S().auto.pickColor) pickColor(); }).observe(bg, { attributes: true, attributeFilter: ['style'] });
    if (S().auto.pickColor) pickColor();

    const chatEl = D.getElementById('chat');
    if (chatEl) { let t; new MutationObserver(() => { clearTimeout(t); t = setTimeout(decorateMessages, 80); }).observe(chatEl, { childList: true }); }
    let rt; W.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(applyAll, 150); });

    autoTime(); autoRandom();
    setInterval(() => {
        autoTime(); renderSlotsNow();
        if (S().auto.random === 'day' && S().auto.randDay !== new Date().toDateString()) autoRandom();
    }, 60 * 1000);
});

function renderSlotsNow() { const now = slotNow(); $('#ltm-slots .ltm-slot').each(function () { $(this).toggleClass('now', $(this).find('select').data('slot') === now); }); }
