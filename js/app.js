const { useState, useEffect, useRef } = React;

// デフォルトチャイム音源URL
const DEFAULT_CHIME_URL = "https://github.com/AfterEffects-OK/SchoolChime/raw/refs/heads/main/Japanese_School_Bell02-01(-16dB).mp3";
const TEST_SOUND_URL = "https://github.com/AfterEffects-OK/SchoolChime/raw/refs/heads/main/Test-Sound.wav";

// 曜日の定義
const DAYS_OF_WEEK = [
    { id: 0, label: '日', color: 'text-red-500' },
    { id: 1, label: '月', color: 'text-gray-700 dark:text-gray-300' },
    { id: 2, label: '火', color: 'text-gray-700 dark:text-gray-300' },
    { id: 3, label: '水', color: 'text-gray-700 dark:text-gray-300' },
    { id: 4, label: '木', color: 'text-gray-700 dark:text-gray-300' },
    { id: 5, label: '金', color: 'text-gray-700 dark:text-gray-300' },
    { id: 6, label: '土', color: 'text-blue-500' },
];

// アイコンコンポーネント
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
// 音声ファイルアップロード用
const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const IconMusic = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
const IconPlay = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconPause = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>;
const IconBell = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.83 14.83a4 4 0 0 0 .58-4.32c-.3-.88-1-1.68-1.78-2.31L12 2l-5.6 5.6c-.78.63-1.48 1.43-1.78 2.31a4 4 0 0 0 .58 4.32"/><path d="M10 20h4"/><path d="M12 2v20"/></svg>;
const IconSun = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
const IconMoon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>;
const IconVolume2 = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
const IconCopy = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const IconAlertTriangle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
const IconHelpCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>;
const IconSpeaker = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><circle cx="12" cy="14" r="4"/><line x1="12" x2="12.01" y1="6" y2="6"/></svg>;
const IconMic = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>;
const IconSettings2 = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>;

const IconLayoutPanelLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="18" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg>;
const IconSlidersHorizontal = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>;
const IconGithub = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>;
// 【再修正】インポート用アイコン（ダウンロード）
const IconImport = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;

// 【再修正】エクスポート用アイコン（ファイルからアップロード）
const IconExport = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5.1"/><polyline points="10 10 12 8 14 10"/><line x1="12" y1="20" x2="12" y2="8"/></svg>;


// アナログ時計コンポーネント
const AnalogClock = ({ time }) => {
    const seconds = time.getSeconds();
    const minutes = time.getMinutes();
    const hours = time.getHours();

    const secondAngle = seconds * 6;
    const minuteAngle = minutes * 6 + seconds * 0.1;
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;

    return (
        <div className="relative w-48 h-48 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* 文字盤背景: ダークモード対応 */}
                <circle cx="50" cy="50" r="48" 
                    className="fill-white stroke-gray-200 dark:fill-gray-700 dark:stroke-gray-600" 
                    strokeWidth="2" />
                
                {/* 目盛り (分): ダークモード対応 */}
                {[...Array(60)].map((_, i) => (
                    <line
                        key={i}
                        x1="50" y1="6"
                        x2="50" y2={i % 5 === 0 ? "12" : "8"}
                        className={i % 5 === 0 ? "stroke-gray-700 dark:stroke-gray-300" : "stroke-gray-300 dark:stroke-gray-500"}
                        strokeWidth={i % 5 === 0 ? "2" : "1"}
                        transform={`rotate(${i * 6} 50 50)`}
                    />
                ))}

                {/* 時針: ダークモード対応 */}
                <line
                    x1="50" y1="50"
                    x2="50" y2="25"
                    className="stroke-gray-800 dark:stroke-gray-300"
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform={`rotate(${hourAngle} 50 50)`}
                />

                {/* 分針: ダークモード対応 */}
                <line
                    x1="50" y1="50"
                    x2="50" y2="15"
                    className="stroke-gray-600 dark:stroke-gray-400"
                    strokeWidth="2"
                    strokeLinecap="round"
                    transform={`rotate(${minuteAngle} 50 50)`}
                />

                {/* 秒針 */}
                <line
                    x1="50" y1="50"
                    x2="50" y2="10"
                    className="stroke-red-500"
                    strokeWidth="1"
                    strokeLinecap="round"
                    transform={`rotate(${secondAngle} 50 50)`}
                />
                
                {/* 中心点 */}
                <circle cx="50" cy="50" r="2" fill="#ef4444" />
            </svg>
        </div>
    );
};

// ステータスパネルコンポーネント
const StatusPanel = ({ isPlaying, playError, audioSources, nextChimeData, currentTime }) => {
    // カウントダウン計算
    let countdown = '';
    if (nextChimeData && nextChimeData.timestamp && currentTime) {
        const diff = nextChimeData.timestamp - currentTime.getTime();
        if (diff > 0) {
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            countdown = `あと ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
    }

    return (
    <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-100 dark:border-indigo-900 pb-1">システムステータス</h3>

        {/* 再生ステータス */}
        <div className={`
            flex items-center space-x-3 p-3 rounded-lg border shadow-sm transition-colors
            ${playError ? 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700' : 
              isPlaying ? 'bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700' : 
              'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700'}
        `}>
            <div className={`p-2 rounded-full ${
                playError ? 'bg-yellow-200 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200' :
                isPlaying ? 'bg-red-200 text-red-700 dark:bg-red-800 dark:text-red-200 animate-pulse' : 
                'bg-green-200 text-green-700 dark:bg-green-800 dark:text-green-200'
            }`}>
                {playError ? <IconAlertTriangle className="w-5 h-5" /> : isPlaying ? <IconPlay /> : <IconCheck />}
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">現在の状態</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {playError ? '再生エラー' : isPlaying ? 'チャイム再生中...' : '待機中'}</p>
            </div>
        </div>

        {/* 音源ステータス */}
        <div className="flex items-center space-x-3 p-3 rounded-lg border dark:border-gray-700 shadow-sm">
            <div className={`p-2 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300`}>
                <IconMusic />
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">音源ファイル</p>
                <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    {/* 
                        次のチャイムに紐づく音源名を表示。
                        なければ、登録されている音源の数を表示。
                    */}
                    {nextChimeData && audioSources.find(a => a.id === nextChimeData.schedule.audioId) ? audioSources.find(a => a.id === nextChimeData.schedule.audioId).name : `${audioSources.length} 音源登録済み`}
                </p>
            </div>
        </div>

        {/* 次のチャイム */}
        <div className="bg-indigo-50 dark:bg-indigo-950 border-2 border-indigo-200 dark:border-indigo-800 p-4 rounded-lg shadow-inner">
            <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 mb-2">
                <IconBell />
                <h4 className="text-sm font-extrabold uppercase">次のチャイム (NEXT CHIME)</h4>
            </div>
            {nextChimeData ? (
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-3xl font-mono font-bold text-indigo-800 dark:text-indigo-200">{nextChimeData.schedule.time}</p>
                        {countdown && <p className="text-sm font-bold text-indigo-800 dark:text-indigo-200 mt-1 font-mono">{countdown}</p>}
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{nextChimeData.dayLabel}</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-gray-100 truncate max-w-xs" title={nextChimeData.schedule.name}>{nextChimeData.schedule.name}</p>
                        <p className="flex items-center justify-end text-xs text-gray-500 dark:text-gray-400 max-w-xs" title={(audioSources.find(a => a.id === nextChimeData.schedule.audioId) || {name: '未設定'}).name}>
                            <IconMusic className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">
                                {(audioSources.find(a => a.id === nextChimeData.schedule.audioId) || {name: '未設定'}).name}
                            </span>
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">有効なスケジュールがありません</p>
            )}
        </div>
    </div>
    );
};


// メインコンポーネント
const App = () => {
    // ステート管理
    const [currentTime, setCurrentTime] = useState(new Date());
    // 音源リストを管理。デフォルト音源を初期値として設定
    const [audioSources, setAudioSources] = useState([
        { id: 'default', name: 'スクールチャイム（デフォルト）', url: DEFAULT_CHIME_URL },
        { id: 'test-sound', name: 'テスト音声', url: TEST_SOUND_URL }
    ]);
    const [schedules, setSchedules] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [lastPlayedTime, setLastPlayedTime] = useState(null); // 重複再生防止用
    const [playError, setPlayError] = useState(null); // 再生エラーの状態
    
    // 編集モーダル管理
    const [editingSchedule, setEditingSchedule] = useState(null); // 編集対象のスケジュールオブジェクト
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const [isGithubModalOpen, setIsGithubModalOpen] = useState(false); // GitHub連携モーダル
    const [isGithubHelpModalOpen, setIsGithubHelpModalOpen] = useState(false); // GitHubヘルプモーダル

    // 新規スケジュール入力用
    const [newName, setNewName] = useState('');
    const [newTime, setNewTime] = useState('08:30');
    const [newDays, setNewDays] = useState([1, 2, 3, 4, 5]); // デフォルト月〜金
    const [newAudioId, setNewAudioId] = useState('default'); // 新規スケジュール用の音源ID
    const [newScheduleType, setNewScheduleType] = useState('weekly'); // 'weekly' or 'date'
    const [newSpecificDate, setNewSpecificDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
    const [newVolume, setNewVolume] = useState(1); // 新規スケジュール用の音量

    const [newSinkId, setNewSinkId] = useState('default'); // 新規スケジュール用の出力デバイスID
    // 個別再生用のステート
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null); // 再生中の音源ID
    const [audioDurations, setAudioDurations] = useState({}); // { id: duration }
    const [audioCurrentTimes, setAudioCurrentTimes] = useState({}); // { id: currentTime }
    const [audioErrors, setAudioErrors] = useState({}); // { id: true } 読み込みエラー管理用

    // URL追加用のステート
    const [newAudioUrl, setNewAudioUrl] = useState('');
    const [newAudioName, setNewAudioName] = useState('');

    // 音声出力デバイス関連のステート
    const [audioDevices, setAudioDevices] = useState([]);
    const [selectedSinkId, setSelectedSinkId] = useState('default');
    const [isSetSinkIdSupported, setIsSetSinkIdSupported] = useState(false);
    const [audioInputDevices, setAudioInputDevices] = useState([]);
    const [selectedInputDeviceId, setSelectedInputDeviceId] = useState('default');
    const [micPermissionError, setMicPermissionError] = useState(null);
    const [isDragging, setIsDragging] = useState(false); // ドラッグ＆ドロップ状態
    const [isGithubDragging, setIsGithubDragging] = useState(false); // GitHub用ドラッグ＆ドロップ状態
    const [isUploading, setIsUploading] = useState(false); // アップロード中フラグ

    // GitHub設定用ステート
    const [githubConfig, setGithubConfig] = useState({
        token: '',
        owner: '',
        repo: '',
        path: 'schedules.json',
        audioPath: 'audio/', // 音源保存用フォルダのデフォルト
        saveCredentials: true // 認証情報を保存するかどうか
    });


    const audioRef = useRef(null);
    const boostAudioRef = useRef(null); // 増幅再生用 (Web Audio API)
    const audioContextRef = useRef(null);
    const gainNodeRef = useRef(null);
    const importInputRef = useRef(null); // インポート用ファイル入力参照
    const audioImportInputRef = useRef(null); // 音源リストインポート用
    const fileInputRef = useRef(null); // 音源アップロード用
    const importIdCounter = useRef(0); // インポート用の一意IDカウンター
    
    // ダークモード状態の初期化と永続化
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('schoolChimeDarkMode');
        if (savedMode !== null) return JSON.parse(savedMode);
        // システム設定の検出 (初回のみ)
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    
    // シンプルモード状態の初期化と永続化
    const [isSimpleMode, setIsSimpleMode] = useState(() => {
        const savedMode = localStorage.getItem('schoolChimeSimpleMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const toggleDarkMode = () => {
        setIsDarkMode(prev => !prev);
    };

    // ダークモード設定を<html>タグに適用し、localStorageに保存
    useEffect(() => {
        const html = document.documentElement;
        if (isDarkMode) {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
        localStorage.setItem('schoolChimeDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    // シンプルモード設定をlocalStorageに保存
    useEffect(() => {
        localStorage.setItem('schoolChimeSimpleMode', JSON.stringify(isSimpleMode));
    }, [isSimpleMode]);

    // setSinkId のサポート状況を確認
    useEffect(() => {
        if ('setSinkId' in HTMLAudioElement.prototype) {
            setIsSetSinkIdSupported(true);
        }
    }, []);

    // 音声出力デバイスのリストを取得・監視
    useEffect(() => {
        const getDevices = async () => {
            try {
                // マイクへのアクセス許可を求めることで、より詳細なデバイスリストを取得できる場合がある
                const stream = await navigator.mediaDevices.getUserMedia({ audio: { deviceId: selectedInputDeviceId === 'default' ? undefined : { exact: selectedInputDeviceId } } });
                // 許可が得られたらすぐにストリームを停止する（マイクを占有し続けないため）
                stream.getTracks().forEach(track => track.stop());
            } catch (err) {
                console.warn('マイクへのアクセスが拒否されたため、デバイスラベルが取得できない可能性があります。', err);
            }
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioOutputDevices = devices.filter(device => device.kind === 'audiooutput');
                const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
                if (isSetSinkIdSupported) setAudioDevices(audioOutputDevices);
                setAudioInputDevices(audioInputDevices);
            } catch (err) {
                console.error('音声デバイスの取得に失敗しました。', err);
            }
        };

        getDevices();
        navigator.mediaDevices.addEventListener('devicechange', getDevices);

        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', getDevices);
        };
    }, [isSetSinkIdSupported, selectedInputDeviceId]);

    // 選択された出力デバイスを永続化
    useEffect(() => {
        const savedSinkId = localStorage.getItem('schoolChimeSinkId');
        if (savedSinkId) {
            setSelectedSinkId(savedSinkId);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('schoolChimeSinkId', selectedSinkId);
        if (audioRef.current && isSetSinkIdSupported) {
            audioRef.current.setSinkId(selectedSinkId).catch(err => console.error('出力先の変更に失敗:', err));
        }
    }, [selectedSinkId, isSetSinkIdSupported]);

    // 選択された入力デバイスを永続化
    useEffect(() => {
        const savedInputDeviceId = localStorage.getItem('schoolChimeInputDeviceId');
        if (savedInputDeviceId) {
            setSelectedInputDeviceId(savedInputDeviceId);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('schoolChimeInputDeviceId', selectedInputDeviceId);
        // 実際のマイク使用は getDevices 内で行われる
    }, [selectedInputDeviceId]);


    // ローカルストレージから音源を読み込み
    useEffect(() => {
        const savedAudioSources = localStorage.getItem('schoolChimeAudioSources');
        if (savedAudioSources) {
            try {
                // URLで追加された音源のみ永続化
                const loadedSources = JSON.parse(savedAudioSources);
                // テスト音声が保存データに含まれていない場合は追加（アップデート対応）
                if (!loadedSources.find(s => s.id === 'test-sound')) {
                    loadedSources.push({ id: 'test-sound', name: 'テスト音声', url: TEST_SOUND_URL });
                }
                setAudioSources(loadedSources);
            } catch (e) {
                console.error("保存された音源の読み込みに失敗しました", e);
            }
        }
    }, []);

    // 音源変更時に保存 (blob URLは除外)
    useEffect(() => {
        const sourcesToSave = audioSources.filter(s => !s.url.startsWith('blob:'));
        localStorage.setItem('schoolChimeAudioSources', JSON.stringify(sourcesToSave));
    }, [audioSources]);

    // GitHub設定の読み込み
    useEffect(() => {
        const savedConfig = localStorage.getItem('schoolChimeGithubConfig');
        if (savedConfig) {
            // 保存された設定を読み込みつつ、新しい設定項目(audioPath)のデフォルト値を維持するためにマージする
            setGithubConfig(prev => ({ ...prev, ...JSON.parse(savedConfig) }));
        }
    }, []);

    // GitHub設定の保存
    useEffect(() => {
        if (githubConfig.saveCredentials) {
            localStorage.setItem('schoolChimeGithubConfig', JSON.stringify(githubConfig));
        } else {
            // 認証情報を保存しない場合、トークンを除外して保存
            const { token, ...configWithoutToken } = githubConfig;
            localStorage.setItem('schoolChimeGithubConfig', JSON.stringify(configWithoutToken));
        }
    }, [githubConfig]);

    // Web Audio API セットアップ (増幅再生用)
    useEffect(() => {
        if (boostAudioRef.current && !audioContextRef.current) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const ctx = new AudioContext();
                audioContextRef.current = ctx;
                
                // ソースとゲインノードの作成
                const source = ctx.createMediaElementSource(boostAudioRef.current);
                const gainNode = ctx.createGain();
                
                // 接続: Source -> Gain -> Destination
                source.connect(gainNode);
                gainNode.connect(ctx.destination);
                
                gainNodeRef.current = gainNode;
            } catch (e) {
                console.error("Web Audio API setup failed:", e);
            }
        }
    }, []);

    // ローカルストレージからスケジュールを読み込み
    useEffect(() => {
        const savedSchedules = localStorage.getItem('schoolChimeSchedules');
        if (savedSchedules) {
            try {
                // スケジュールはリロード後も永続化されます。
                setSchedules(JSON.parse(savedSchedules));
            } catch (e) {
                console.error("保存されたスケジュールの読み込みに失敗しました", e);
            }
        }
    }, []);

    // スケジュール変更時に保存
    useEffect(() => {
        // スケジュールが変更されるたびにローカルストレージに保存します。
        localStorage.setItem('schoolChimeSchedules', JSON.stringify(schedules));
    }, [schedules]);

    // 時計の更新とアラームチェック
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            checkAlarm(now);
        }, 1000);

        return () => clearInterval(timer);
    }, [schedules, lastPlayedTime]);

    // 誤操作によるタブ閉じ防止（離脱防止アラート）
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    // アラームチェックロジック
    const checkAlarm = (now) => {
        // 音声ファイルがセットされていない場合は何もしない (audioSrcはデフォルトでセットされているため、ここではaudioRefの準備のみチェック)
        if (!audioRef.current) return;

        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentSecond = now.getSeconds();
        const currentDay = now.getDay();

        // HH:mm 形式の文字列を作成
        const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        
        // 重複再生防止（同じ分内での連打防止、0秒付近のみでトリガー）
        // if (currentSecond > 2) return; 
        
        // 最後に再生した時間が現在と同じ分ならスキップ（1分間に1回だけ鳴らす）
        if (lastPlayedTime === timeString) return;

        // スケジュールと照合
        const activeSchedule = schedules.find(schedule => {
            if (!schedule.enabled || schedule.time !== timeString) return false;

            const type = schedule.scheduleType || 'weekly'; // 下位互換性

            if (type === 'weekly') {
                return schedule.days.includes(currentDay);
            }
            
            if (type === 'date') {
                const scheduleDate = schedule.specificDate; // YYYY-MM-DD
                const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                return scheduleDate === todayDate;
            }
            return false;
        });

        if (activeSchedule) {
            playChime(activeSchedule);
            setLastPlayedTime(timeString);
        }
    };

    // 次のチャイムを計算するロジック
    const getNextChime = (now) => {
        const nowTimestamp = now.getTime();
        let soonestTimestamp = Infinity;
        let soonestChime = null;
        let soonestDayLabel = '';

        schedules.filter(s => s.enabled).forEach(schedule => {
            const type = schedule.scheduleType || 'weekly';
            const [hour, minute] = schedule.time.split(':').map(Number);

            if (type === 'date') {
                const scheduleDate = new Date(`${schedule.specificDate}T${schedule.time}:00`);
                const scheduleTimestamp = scheduleDate.getTime();
                if (scheduleTimestamp > nowTimestamp && scheduleTimestamp < soonestTimestamp) {
                    soonestTimestamp = scheduleTimestamp;
                    soonestChime = schedule;
                    soonestDayLabel = schedule.specificDate.replace(/-/g, '/');
                }
            } else { // weekly
                // 今から1週間先までチェック
                for (let i = 0; i < 8; i++) {
                    const checkDate = new Date(now);
                    checkDate.setDate(now.getDate() + i);
                    const checkDay = checkDate.getDay();

                    if (schedule.days.includes(checkDay)) {
                        checkDate.setHours(hour, minute, 0, 0);
                        const scheduleTimestamp = checkDate.getTime();

                        if (scheduleTimestamp > nowTimestamp && scheduleTimestamp < soonestTimestamp) {
                            soonestTimestamp = scheduleTimestamp;
                            soonestChime = schedule;
                            if (i === 0) soonestDayLabel = '今日';
                            else if (i === 1) soonestDayLabel = '明日';
                            else soonestDayLabel = DAYS_OF_WEEK.find(d => d.id === checkDay).label + '曜日';
                            // この曜日で見つかったので、このスケジュールについてはこれ以上未来を探す必要はない
                            break; 
                        }
                    }
                }
            }
        });

        return soonestChime ? { schedule: soonestChime, dayLabel: soonestDayLabel, timestamp: soonestTimestamp } : null;
    };

    // チャイム再生
    const playChime = async (schedule) => {
        // 両方のプレイヤーを停止・リセット
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        if (boostAudioRef.current) { boostAudioRef.current.pause(); boostAudioRef.current.currentTime = 0; }

        const audioIdToPlay = schedule.audioId || 'default';
        const sourceToPlay = audioSources.find(s => s.id === audioIdToPlay) || audioSources[0];
        
        if (sourceToPlay) {
            console.log(`チャイム再生: ${schedule.name} (${sourceToPlay.name})`);

            const vol = schedule.volume ?? 1;
            let useBoost = vol > 1.0; // 音量が100%を超える場合はブーストモード

            // クラウドストレージのURL（CORS制限があるもの）はブーストモードを強制無効化
            // Web Audio APIで再生するにはCORSヘッダーが必要だが、Google Drive等は返さないため再生エラーになる
            if (useBoost && (
                sourceToPlay.url.includes('drive.google.com') || 
                sourceToPlay.url.includes('docs.google.com') ||
                sourceToPlay.url.includes('dropbox.com') || 
                sourceToPlay.url.includes('onedrive') ||
                sourceToPlay.url.includes('1drv.ms')
            )) {
                console.warn("CORS制限のため、この音源ではブーストモード(100%超)が無効化され、通常再生(最大100%)になります。");
                useBoost = false;
            }
            
            // 使用するプレイヤーを選択
            const player = useBoost ? boostAudioRef.current : audioRef.current;
            if (!player) return;
            
            // 出力デバイスの決定: スケジュール固有の設定 -> 全体設定 の順で優先
            const targetSinkId = (schedule.sinkId && schedule.sinkId !== 'default') ? schedule.sinkId : selectedSinkId;

            // 出力先を設定
            if (isSetSinkIdSupported && player.sinkId !== targetSinkId) {
                try {
                    await player.setSinkId(targetSinkId);
                } catch (err) {
                    console.error(`出力先の変更に失敗: ${targetSinkId}`, err);
                }
            }

            // 音量設定
            if (useBoost) {
                // Web Audio API (GainNode) で増幅
                if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume();
                }
                if (gainNodeRef.current) {
                    gainNodeRef.current.gain.value = vol; // 1.0超えの値を設定
                }
                player.volume = 1.0; // 要素自体は最大にしておく
            } else {
                // 通常再生
                player.volume = Math.min(vol, 1.0);
            }

            // 再生ソースを動的に設定
            player.src = sourceToPlay.url;
            try {
                await player.play();
                setIsPlaying(true);
                setPlayError(null); // 再生成功時にエラーをクリア
            } catch (err) {
                setPlayError(err);
            }
        } else {
            alert(`音源が見つかりません: ${schedule.name} (ID: ${audioIdToPlay})`);
        }
    };

    // ファイル処理ロジック（共通）
    const processFiles = (files) => {
        const newSources = [];
        Array.from(files).forEach((file, index) => {
            // audioタイプまたは一般的な音声拡張子をチェック
            if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
                const url = URL.createObjectURL(file);
                newSources.push({
                    id: `custom-${Date.now()}-${index}`, // 一意性を確保
                    name: file.name,
                    url: url
                });
            } else {
                alert(`${file.name} は音声ファイルとして認識されませんでした。`);
            }
        });
        
        if (newSources.length > 0) {
            setAudioSources(prev => [...prev, ...newSources]);
        }
    };

    // ドラッグ＆ドロップイベントハンドラ
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
    };

    // 音声アップロード処理 (input経由)
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
        // 同じファイルを連続で選択できるようにリセット
        e.target.value = null;
    };
    
    // 音源削除
    const deleteAudioSource = (idToDelete) => {
        const sourceToDelete = audioSources.find(s => s.id === idToDelete);
        if (sourceToDelete && sourceToDelete.url.startsWith('blob:')) URL.revokeObjectURL(sourceToDelete.url);
        setAudioSources(prev => prev.filter(s => s.id !== idToDelete));
    };

    // クラウドサービスの共有URLを直接再生可能なURLに変換する
    const transformCloudUrl = (url) => {
        try {
            // Google Drive & Docs
            if (url.includes('drive.google.com') || url.includes('docs.google.com')) {
                // パターン1: .../file/d/FILE_ID/... (間に /u/0/ などが入る場合に対応)
                let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                
                // パターン2: ...id=FILE_ID...
                if (!match) {
                    match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
                }
                
                if (match && match[1]) {
                    const fileId = match[1];
                    
                    // resourcekeyパラメータがある場合は維持する（セキュリティアップデート対応）
                    let resourceKey = '';
                    const resourceKeyMatch = url.match(/[?&]resourcekey=([a-zA-Z0-9_-]+)/);
                    if (resourceKeyMatch) {
                        resourceKey = `&resourcekey=${resourceKeyMatch[1]}`;
                    }

                    console.log("Google Driveのリンクを変換:", fileId);
                    // docs.google.com は一部環境でブロックされるため drive.google.com に戻し、confirmパラメータを追加
                    return `https://drive.google.com/uc?export=download&id=${fileId}${resourceKey}`;
                }
            }

            // Dropbox: https://www.dropbox.com/s/..../file.mp3?dl=0
            if (url.includes('dropbox.com/s/')) {
                const newUrl = new URL(url);
                newUrl.searchParams.set('dl', '1');
                console.log("Dropboxのリンクを変換:", newUrl.toString());
                return newUrl.toString();
            }

            // OneDrive: https://1drv.ms/u/s!... or https://onedrive.live.com/...
            if (url.includes('1drv.ms') || url.includes('onedrive.live.com')) {
                // Base64エンコードし、末尾の'='を削除し、URLセーフな文字に置換
                const base64Url = btoa(url).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
                const directUrl = `https://api.onedrive.com/v1.0/shares/u!${base64Url}/root/content`;
                console.log("OneDriveのリンクを変換:", directUrl);
                return directUrl;
            }

        } catch (e) {
            console.error("URLの変換に失敗しました:", e);
            return url; // エラーが発生した場合は元のURLを返す
        }

        // 一致するパターンがなければ元のURLを返す
        return url;
    };

    // URLから音源を追加
    const addAudioSourceFromUrl = () => {
        if (!newAudioUrl || !newAudioName) {
            alert('音源のURLと表示名を入力してください。');
            return;
        }

        // Google Drive等のURLの場合、確実な再生のためにGitHubアップロードを推奨する確認を表示
        if (newAudioUrl.includes('drive.google.com') || newAudioUrl.includes('docs.google.com')) {
            const msg = '【Google Driveのリンクについて】\n' +
                        'Google DriveのURLは、ブラウザのセキュリティ制限により再生できない場合が多いです。\n' +
                        '（※URL変換を行っても、再生が不安定な場合があります）\n\n' +
                        '確実な動作のためには、「GitHub連携」のアップロード機能を使用することを強く推奨します。\n\n' +
                        'このままURLとして登録しますか？';
            if (!confirm(msg)) {
                return;
            }
        }

        const transformedUrl = transformCloudUrl(newAudioUrl);
        const newSource = {
            id: `custom-${Date.now()}`,
            name: newAudioName,
            url: transformedUrl,
            from: 'url' // どこから追加されたかの目印
        };
        setAudioSources(prev => [...prev, newSource]);
        setNewAudioUrl('');
        setNewAudioName('');
    };

    // 個別再生/一時停止のトグル
    const toggleAudioPlayback = (source) => {
        // ブースト用プレイヤーも停止しておく
        if (boostAudioRef.current) { boostAudioRef.current.pause(); boostAudioRef.current.currentTime = 0; }

        if (currentlyPlayingId === source.id) {
            // 再生中なので一時停止
            audioRef.current.pause();
            setCurrentlyPlayingId(null);
        } else {
            // 別の音源を再生
            if (audioErrors[source.id]) {
                alert("この音源は読み込みエラーのため再生できません。\nリンクが正しいか、公開設定になっているか確認してください。");
                return;
            }
            setCurrentlyPlayingId(source.id);
            audioRef.current.src = source.url;
            audioRef.current.play().catch(e => console.error("Playback failed:", e));
        }
    };

    // audio要素のイベントハンドラ
    const onAudioPlay = () => {
        setIsPlaying(true);
        setPlayError(null); // 再生開始時にエラーをクリア
    };
    const onAudioPauseOrEnd = () => {
        setIsPlaying(false);
        setCurrentlyPlayingId(null);
    };
    const onAudioTimeUpdate = () => {
        if (!currentlyPlayingId) return;
        setAudioCurrentTimes(prev => ({
            ...prev,
            [currentlyPlayingId]: audioRef.current.currentTime
        }));
    };
    const onAudioLoadedMetadata = (e, sourceId) => {
        // すべての音源でdurationを取得 (Blob URLだけでなく、Google Drive等のURLも対象)
        const duration = e.target.duration;
        if (Number.isFinite(duration)) {
            setAudioDurations(prev => {
                if (prev[sourceId] === duration) return prev;
                return {
                    ...prev,
                    [sourceId]: duration
                };
            });
        }
    };
    // 音源読み込みエラーハンドラ
    const onAudioError = (id) => {
        console.error(`Audio load error for id: ${id}`);
        setAudioErrors(prev => ({ ...prev, [id]: true }));
    };
    
    // デフォルト音源のdurationを取得するためのuseEffect
    useEffect(() => {
        const loadDuration = (id, url) => {
            const audio = new Audio(url);
            const handleMetadata = () => {
                setAudioDurations(prev => ({ ...prev, [id]: audio.duration }));
                audio.removeEventListener('loadedmetadata', handleMetadata);
            };
            audio.addEventListener('loadedmetadata', handleMetadata);
        };

        loadDuration('default', DEFAULT_CHIME_URL);
        loadDuration('test-sound', TEST_SOUND_URL);
    }, []);

    // 時間を mm:ss 形式にフォーマット
    const formatTime = (seconds) => {
        if (isNaN(seconds) || seconds === Infinity) return '00:00';
        const floorSeconds = Math.floor(seconds);
        const min = Math.floor(floorSeconds / 60);
        const sec = floorSeconds % 60;
        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    // スケジュール追加
    const addSchedule = () => {
        if (!newName || !newTime) {
            alert('名前と時間を入力してください'); 
            return;
        }
        if (newScheduleType === 'weekly' && newDays.length === 0) {
            alert('曜日を少なくとも1つ選択してください');
            return;
        }
        if (newScheduleType === 'date' && !newSpecificDate) {
            alert('日付を指定してください');
            return;
        }

        const newSchedule = {
            id: Date.now(),
            name: newName,
            time: newTime,
            enabled: true,
            audioId: newAudioId,
            volume: newVolume,
            scheduleType: newScheduleType,
            sinkId: newSinkId, // 出力デバイスIDを追加
            // タイプに応じてデータを格納
            days: newScheduleType === 'weekly' ? newDays : [],
            specificDate: newScheduleType === 'date' ? newSpecificDate : '',
        };

        setSchedules([...schedules, newSchedule]);
        
        // 入力フォームをリセット
        setNewName('');
        setNewAudioId('default');
        // タイプと日付はリセットしないでおく
        // setNewScheduleType('weekly');
        // setNewSpecificDate(new Date().toISOString().slice(0, 10));
        setNewVolume(1);
        setNewSinkId('default');
        // 時間と曜日はリセットせず、連続入力をしやすくする
    };

    // スケジュール削除
    const deleteSchedule = (id) => {
        // カスタムモーダルを使うべき
        if (confirm('このスケジュールを削除しますか？')) {
            setSchedules(schedules.filter(s => s.id !== id));
        }
    };
    
    // スケジュール複製
    const duplicateSchedule = (id) => {
        const scheduleToCopy = schedules.find(s => s.id === id);
        if (!scheduleToCopy) return;

        const newSchedule = {
            ...scheduleToCopy,
            id: Date.now(),
            name: `${scheduleToCopy.name} (コピー)`,
        };

        // 元のスケジュールの直後に追加
        const index = schedules.findIndex(s => s.id === id);
        const newSchedules = [...schedules];
        newSchedules.splice(index + 1, 0, newSchedule);
        setSchedules(newSchedules);
    };

    // スケジュール有効/無効切り替え
    const toggleSchedule = (id) => {
        setSchedules(schedules.map(s => 
            s.id === id ? { ...s, enabled: !s.enabled } : s
        ));
    };

    // 曜日選択の切り替え
    const toggleDay = (dayId) => {
        if (newDays.includes(dayId)) {
            setNewDays(newDays.filter(d => d !== dayId));
        } else {
            setNewDays([...newDays, dayId].sort());
        }
    };
    
    // 編集モーダルを開く
    const openEditModal = (schedule) => {
        setEditingSchedule({ 
            ...schedule, 
            volume: schedule.volume ?? 1,
            scheduleType: schedule.scheduleType || 'weekly', // 下位互換性
            specificDate: schedule.specificDate || new Date().toISOString().slice(0, 10),
            sinkId: schedule.sinkId || 'default', // 下位互換性
        });
    };

    // 編集モーダルを閉じる
    const closeEditModal = () => {
        setEditingSchedule(null);
    };

    // スケジュール更新処理
    const updateSchedule = () => {
        if (!editingSchedule) return;
        
        setSchedules(schedules.map(s => 
            s.id === editingSchedule.id ? editingSchedule : s
        ));
        
        // モーダルを閉じる
        closeEditModal();
    };
    
    // 注意事項モーダル
    const openWarningModal = () => setIsWarningModalOpen(true);
    const closeWarningModal = () => setIsWarningModalOpen(false);

    // 使い方モーダル
    const openHelpModal = () => setIsHelpModalOpen(true);
    const closeHelpModal = () => setIsHelpModalOpen(false);


    // スケジュールエクスポート機能
    const handleExport = () => {
        if (schedules.length === 0) {
            alert('エクスポートするスケジュールがありません。');
            return;
        }
        const jsonString = JSON.stringify(schedules, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `school_chime_schedule_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('スケジュールをエクスポートしました。'); 
    };
    
    // スケジュールインポート機能
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedSchedules = JSON.parse(event.target.result);
                
                // 基本的な形式のバリデーション
                if (!Array.isArray(importedSchedules) || importedSchedules.some(s => 
                    !s.id || typeof s.name !== 'string' || typeof s.time !== 'string'
                )) {
                    alert('インポートされたファイルの形式が正しくありません。期待されるJSON配列形式を確認してください。');
                    return;
                }

                // IDの重複を防ぐため、強制的に新しいIDを割り当てる（簡易処理）
                const schedulesWithNewIds = importedSchedules.map(s => ({
                    ...s,
                    id: Date.now() + (importIdCounter.current++), 
                    enabled: s.enabled ?? true,
                    scheduleType: s.scheduleType || 'weekly',
                    days: s.days || [],
                    specificDate: s.specificDate || '',
                    volume: s.volume ?? 1,
                    // タイムゾーンや日付の調整は複雑なため、time文字列のみを信頼する
                }));

                // 現在のスケジュールを置き換える
                setSchedules(schedulesWithNewIds);
                alert(`${schedulesWithNewIds.length}件のスケジュールをインポートしました。`);

            } catch (error) {
                console.error("スケジュールインポートエラー:", error);
                alert('ファイルの読み込みまたは解析に失敗しました。ファイルが有効なJSON形式であることを確認してください。');
            }
        };
        
        reader.onerror = () => {
            alert('ファイルの読み込みに失敗しました。');
        };

        reader.readAsText(file);
        // ファイル入力をリセットして、同じファイルを再度選択できるようにする
        e.target.value = null; 
    };

    // 音源リストエクスポート機能
    const handleAudioExport = () => {
        // blob: で始まるURL（ローカルファイル）は他環境で無効なため除外してエクスポート
        const sourcesToExport = audioSources.filter(s => !s.url.startsWith('blob:'));
        const blobSourcesCount = audioSources.length - sourcesToExport.length;

        if (sourcesToExport.length === 0) {
            alert('エクスポート可能な音源リンクがありません。\n(ローカルファイルから追加した音源はエクスポートできません)');
            return;
        }

        if (blobSourcesCount > 0) {
            if (!confirm(`${blobSourcesCount}件の音源はローカルファイルのためエクスポート対象外となります。\nWeb上のリンクを持つ音源のみエクスポートしますか？`)) {
                return;
            }
        }

        const jsonString = JSON.stringify(sourcesToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `school_chime_audio_links_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // 音源リストインポート機能
    const handleAudioImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedSources = JSON.parse(event.target.result);
                if (!Array.isArray(importedSources)) {
                    alert('ファイル形式が正しくありません。');
                    return;
                }

                // URL重複チェックを行い、新規のみ追加
                const currentUrls = new Set(audioSources.map(s => s.url));
                const newSources = importedSources.filter(s => s.url && !currentUrls.has(s.url)).map(s => ({
                    ...s,
                    id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` // ID衝突回避
                }));

                if (newSources.length === 0) {
                    alert('新しい音源はありませんでした（すべて登録済みか、無効なデータです）。');
                } else {
                    setAudioSources(prev => [...prev, ...newSources]);
                    alert(`${newSources.length}件の音源リンクを追加しました。`);
                }
            } catch (error) {
                console.error("音源インポートエラー:", error);
                alert('ファイルの読み込みに失敗しました。');
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    // GitHubへの保存処理
    const handleGithubSave = async () => {
        if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo || !githubConfig.path) {
            alert('GitHub設定をすべて入力してください。');
            return;
        }

        try {
            // 音源リストの保存処理（ファイルデータも含む）
            const sourcesToSave = await Promise.all(audioSources.map(async (source) => {
                // Blob URLの場合（ファイルから追加されたもの）はデータを埋め込む
                if (source.url.startsWith('blob:')) {
                    try {
                        const response = await fetch(source.url);
                        const blob = await response.blob();
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                                // Data URL形式 (data:audio/mp3;base64,...) で取得
                                resolve({
                                    ...source,
                                    url: '', // 元のBlob URLは他PCでは無効なため空にする
                                    isBlob: true, // 復元時のフラグ
                                    dataUrl: reader.result // 実データ（Base64）
                                });
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        });
                    } catch (e) {
                        console.error("Failed to process blob source:", source.name, e);
                        return null; // エラー時は除外
                    }
                }
                // 通常のURL音源の場合
                return source;
            }));

            // null（エラー）を除外
            const validSources = sourcesToSave.filter(s => s !== null);

            const dataToSave = {
                audioSources: validSources
            };
            const content = JSON.stringify(dataToSave, null, 2);
            // 日本語対応のため、UTF-8文字列をBase64にエンコード
            const base64Content = btoa(unescape(encodeURIComponent(content)));
            
            const apiUrl = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${githubConfig.path}`;
            
            // 1. ファイルが存在するか確認し、SHAを取得（更新用）
            let sha = null;
            try {
                const res = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `token ${githubConfig.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    sha = data.sha;
                }
            } catch (e) { console.warn("File check failed (new file?)", e); }

            // 2. ファイル作成/更新リクエスト
            const body = {
                message: `Update schedules: ${new Date().toLocaleString()}`,
                content: base64Content,
                ...(sha ? { sha } : {})
            };

            const putRes = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubConfig.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            });

            if (!putRes.ok) {
                const errData = await putRes.json();
                throw new Error(errData.message || 'Save failed');
            }

            alert('GitHubに保存しました！');
            setIsGithubModalOpen(false);

        } catch (error) {
            console.error(error);
            alert(`保存に失敗しました: ${error.message}`);
        }
    };

    // GitHubからの読み込み処理
    const handleGithubLoad = async () => {
            if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo || !githubConfig.path) {
            alert('GitHub設定をすべて入力してください。');
            return;
        }
        
        try {
            const apiUrl = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${githubConfig.path}`;
            const res = await fetch(apiUrl, {
                headers: {
                    'Authorization': `token ${githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!res.ok) throw new Error('File not found or access denied');
            
            const data = await res.json();
            // Base64デコード（日本語対応）
            const content = decodeURIComponent(escape(atob(data.content)));
            const loadedData = JSON.parse(content);

            if (confirm('現在の音源設定を上書きして、GitHubから読み込みますか？\n(スケジュールは変更されません)')) {
                    // 配列なら旧形式（スケジュールのみ）、オブジェクトなら新形式（スケジュール+音源）
                    if (Array.isArray(loadedData)) {
                        alert('このファイルは旧形式（スケジュールのみ）のため、音源データが含まれていません。');
                    } else {
                        if (loadedData.audioSources) {
                            // Data URLを持つ音源をBlob URLに復元
                            const restoredSources = loadedData.audioSources.map(source => {
                                if (source.isBlob && source.dataUrl) {
                                    try {
                                        // Data URL -> Blob -> Blob URL
                                        const arr = source.dataUrl.split(',');
                                        const mime = arr[0].match(/:(.*?);/)[1];
                                        const bstr = atob(arr[1]);
                                        let n = bstr.length;
                                        const u8arr = new Uint8Array(n);
                                        while(n--){
                                            u8arr[n] = bstr.charCodeAt(n);
                                        }
                                        const blob = new Blob([u8arr], {type:mime});
                                        const newUrl = URL.createObjectURL(blob);
                                        
                                        // 不要になったdataUrlはメモリ節約のため削除
                                        const { dataUrl, isBlob, ...rest } = source;
                                        return { ...rest, url: newUrl };
                                    } catch (e) {
                                        console.error("Failed to restore blob:", source.name, e);
                                        return source;
                                    }
                                }
                                return source;
                            });

                            setAudioSources(restoredSources);
                            alert('音源設定（ファイルデータ含む）の読み込みが完了しました。');
                        } else {
                            alert('保存されたデータに音源リストが見つかりませんでした。');
                        }
                    }
                    setIsGithubModalOpen(false);
            }

        } catch (error) {
            console.error(error);
            alert(`読み込みに失敗しました: ${error.message}`);
        }
    };
    
    // GitHubへの音源アップロード処理
    const handleGithubAudioUpload = async (files) => {
        if (!githubConfig.token || !githubConfig.owner || !githubConfig.repo) {
            alert('GitHub設定（トークン、ユーザー名、リポジトリ名）を入力してください。');
            return;
        }

        setIsUploading(true);
        let successCount = 0;
        let failCount = 0;

        for (const file of Array.from(files)) {
            try {
                // パスの構築 (末尾のスラッシュ処理など)
                const dir = githubConfig.audioPath ? githubConfig.audioPath.replace(/\/$/, '') : 'audio';
                const path = `${dir}/${file.name}`;
                const apiUrl = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`;

                // ファイル読み込み (Base64)
                const content = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                // 既存ファイルの確認 (SHA取得)
                let sha = null;
                try {
                    const res = await fetch(apiUrl, {
                        headers: {
                            'Authorization': `token ${githubConfig.token}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        sha = data.sha;
                    }
                } catch (e) { /* ignore */ }

                // アップロード (PUT)
                const body = {
                    message: `Upload audio: ${file.name}`,
                    content: content,
                    ...(sha ? { sha } : {})
                };

                const putRes = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${githubConfig.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                });

                if (!putRes.ok) throw new Error('Upload failed');

                const data = await putRes.json();
                const downloadUrl = data.content.download_url;

                // 音源リストに追加
                setAudioSources(prev => [
                    ...prev,
                    {
                        id: `github-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
                        name: file.name,
                        url: downloadUrl,
                        from: 'github'
                    }
                ]);
                successCount++;

            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error);
                failCount++;
            }
        }

        setIsUploading(false);
        alert(`${successCount}件のファイルをアップロードしました。${failCount > 0 ? `(${failCount}件失敗)` : ''}`);
    };

    // GitHub用ドラッグ＆ドロップハンドラ
    const handleGithubDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsGithubDragging(true); };
    const handleGithubDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsGithubDragging(false); };
    const handleGithubDrop = (e) => {
        e.preventDefault(); e.stopPropagation(); setIsGithubDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) handleGithubAudioUpload(files);
    };

    // 次のチャイムデータを計算
    const nextChimeData = getNextChime(currentTime);

    // audioRef用の再生ソース。何も再生していないときはデフォルト音源を指しておく
    const initialAudioSrc = (audioSources.find(s => s.id === 'default') || audioSources[0] || {}).url;

    return (
        <div className="min-h-screen pb-10 bg-gray-100 dark:bg-gray-900">
            {/* ヘッダー */}
            <header className="bg-indigo-600 text-white p-4 shadow-md">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <IconClock />
                        <h1 className="text-xl font-bold">スクールチャイム管理</h1>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {/* 使い方ボタン */}
                        <button 
                            onClick={openHelpModal}
                            className="p-2 rounded-full hover:bg-indigo-500 transition-colors"
                            title="使い方"
                        >
                            <IconHelpCircle />
                        </button>
                        {/* シンプルモードトグルボタン */}
                        <button 
                            onClick={() => setIsSimpleMode(prev => !prev)}
                            className="p-2 rounded-full hover:bg-indigo-500 transition-colors"
                            title={isSimpleMode ? '設定パネルを表示' : '設定パネルを隠す'}
                        >
                            {isSimpleMode ? <IconLayoutPanelLeft /> : <IconSlidersHorizontal />}
                        </button>
                        {/* ダークモードトグルボタン */}
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full hover:bg-indigo-500 transition-colors"
                            title={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
                        >
                            {isDarkMode ? <IconSun /> : <IconMoon />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto p-4 max-w-5xl space-y-6">
                
                {/* 時計表示エリア & ステータスパネル */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border-b-4 border-indigo-500">
                    <div className="flex flex-col lg:flex-row lg:divide-x divide-gray-200 dark:divide-gray-700">
                        
                        {/* 左側: 時計本体 */}
                        <div className="lg:w-1/2 p-4 text-center">
                            <div className="text-gray-500 dark:text-gray-400 mb-2 font-medium">現在時刻</div>
                            <AnalogClock time={currentTime} />
                            
                            <div className="text-6xl md:text-8xl font-mono font-bold text-gray-800 dark:text-gray-100 digital-clock tracking-tight">
                                {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                            <div className="text-xl text-gray-500 dark:text-gray-400 mt-2 font-bold">
                                {currentTime.toLocaleDateString('ja-JP', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>

                        {/* 右側: ステータスパネル */}
                        <div className="lg:w-1/2 p-4 pt-8 lg:pt-0">
                            <StatusPanel 
                                isPlaying={isPlaying} 
                                playError={playError}
                                audioSources={audioSources}
                                nextChimeData={nextChimeData} 
                                currentTime={currentTime}
                            />
                        </div>
                    </div>
                </div>
                
                {/* 汎用再生用の非表示audio要素 */}
                <audio
                    ref={audioRef} 
                    onPlay={onAudioPlay}
                    onPause={onAudioPauseOrEnd}
                    onEnded={onAudioPauseOrEnd}
                    onTimeUpdate={onAudioTimeUpdate}
                    className="hidden"
                    referrerPolicy="no-referrer"
                />

                {/* 増幅再生用 (Web Audio API) の非表示audio要素 */}
                <audio
                    ref={boostAudioRef} 
                    onPlay={onAudioPlay}
                    onPause={onAudioPauseOrEnd}
                    onEnded={onAudioPauseOrEnd}
                    onTimeUpdate={onAudioTimeUpdate}
                    className="hidden"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                />

                {/* 通常モードでのみ表示されるセクション */}
                {!isSimpleMode && (
                    <>
                        {((isSetSinkIdSupported && audioDevices.length > 0) || audioInputDevices.length > 0) && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b dark:border-gray-700 pb-2">
                                    <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg dark:bg-indigo-900 dark:text-indigo-300"><IconSettings2 /></span>
                                    全体デバイス設定
                                </h2>
                                {micPermissionError && (
                                    <div className="mb-4 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200 text-sm flex items-center gap-2">
                                        <IconAlertTriangle className="w-5 h-5 flex-shrink-0" />
                                        <div>
                                            <span className="font-bold">デバイス名が正しく表示されません:</span> {micPermissionError}
                                            <p className="text-xs mt-1">ブラウザのアドレスバーの左にあるアイコンをクリックし、マイクのアクセスを許可してからページを再読み込みしてください。</p>
                                        </div>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 入力デバイス設定 */}
                                    {audioInputDevices.length > 0 && (
                                        <div>
                                            <label htmlFor="audio-input-select" className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1"><IconMic className="w-4 h-4" />入力デバイス (マイク)</label>
                                            <select 
                                                id="audio-input-select"
                                                value={selectedInputDeviceId} 
                                                onChange={(e) => setSelectedInputDeviceId(e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                            >
                                                <option value="default">システム標準</option>
                                                {audioInputDevices.map(device => <option key={device.deviceId} value={device.deviceId}>{device.label || `マイク ${device.deviceId.substring(0, 8)}`}</option>)}
                                            </select>
                                        </div>
                                    )}
                                    {/* 出力デバイス設定 */}
                                    {isSetSinkIdSupported && audioDevices.length > 0 && (
                                        <div>
                                            <label htmlFor="audio-output-select" className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1"><IconSpeaker className="w-4 h-4" />出力デバイス (スピーカー)</label>
                                            <select 
                                                id="audio-output-select"
                                                value={selectedSinkId} 
                                                onChange={(e) => setSelectedSinkId(e.target.value)}
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                            >
                                                <option value="default">システム標準</option>
                                                {audioDevices.map(device => <option key={device.deviceId} value={device.deviceId}>{device.label || `スピーカー ${device.deviceId.substring(0, 8)}`}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b dark:border-gray-700 pb-2">
                            <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg dark:bg-indigo-900 dark:text-indigo-300"><IconMusic /></span>
                            ステップ 1: チャイム音の設定
                        </h2>
                        
                        {/* GitHub連携ボタン */}
                        <div className="mb-4">
                            <button onClick={() => setIsGithubModalOpen(true)} className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg cursor-pointer transition shadow-sm text-sm w-full md:w-auto">
                                <IconGithub />
                                <span>GitHub連携 (音源ファイルも保存)</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* 左側: URLから追加 */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400">URLから追加 (保存可能)</h3>
                                <input 
                                    type="text" 
                                    placeholder="音声URLまたは共有リンク (Google Drive, Dropbox, OneDrive)" 
                                    value={newAudioUrl}
                                    onChange={(e) => setNewAudioUrl(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                <input 
                                    type="text" 
                                    placeholder="表示名" 
                                    value={newAudioName}
                                    onChange={(e) => setNewAudioName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                                <button onClick={addAudioSourceFromUrl} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md">
                                    + URLから音源を追加
                                </button>
                                {/* ファイルからアップロード */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`
                                        relative border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer mt-2
                                        ${isDragging 
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                                            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400 bg-gray-50 dark:bg-gray-700/50'}
                                    `}
                                >
                                    <input type="file" accept="audio/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" ref={fileInputRef} multiple />
                                    <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                                        <IconUpload className={`w-6 h-6 ${isDragging ? 'text-indigo-600' : 'text-gray-400'}`} />
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{isDragging ? 'ドロップして追加' : 'ファイルを選択 または D&D'}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">(一時的・GitHub保存可)</span>
                                    </div>
                                </div>
                                {/* 注意書き */}
                                <button onClick={openWarningModal} className="flex items-center justify-center gap-2 text-xs text-yellow-600 dark:text-yellow-400 hover:underline pt-1 w-full">
                                    <IconAlertTriangle className="w-3 h-3" />
                                    <span>ファイルから追加する場合の注意点</span>
                                </button>
                            </div>
                            
                            {/* 右側: 音源リスト */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-600 dark:text-gray-400">登録済み音源リスト</h3>
                                    <div className="flex gap-1">
                                        <button onClick={() => audioImportInputRef.current.click()} className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition flex items-center gap-1" title="音源リストをインポート">
                                            <IconImport className="w-3 h-3" /> インポート
                                        </button>
                                        <input type="file" accept=".json" onChange={handleAudioImport} ref={audioImportInputRef} className="hidden" />
                                        <button onClick={handleAudioExport} className="text-xs bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-1" title="音源リストをエクスポート">
                                            <IconExport className="w-3 h-3" /> エクスポート
                                        </button>
                                    </div>
                                </div>
                                {audioSources.map(source => (
                                    <div key={source.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                                        <button onClick={() => toggleAudioPlayback(source)} className="p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900">
                                            {currentlyPlayingId === source.id ? <IconPause /> : <IconPlay />}
                                        </button>
                                        <div className="flex-1 truncate">
                                            <p className="text-sm text-gray-800 dark:text-gray-200 truncate" title={source.name}>
                                                {source.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                {audioErrors[source.id] ? <span className="text-red-500 font-bold">⚠ 読込失敗 (公開設定やCookieブロックを確認)</span> : 
                                                 `${formatTime(audioCurrentTimes[source.id] || 0)} / ${formatTime(audioDurations[source.id] || 0)}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            {source.id !== 'default' && (
                                                <button 
                                                    onClick={() => deleteAudioSource(source.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 rounded-full"
                                                    title="この音源を削除"
                                                >
                                                    <IconTrash />
                                                </button>
                                            )}
                                        </div>
                                        {/* 各カスタム音源のdurationを取得するための非表示audio要素 */}
                                        {source.id !== 'default' && (
                                            <audio 
                                                src={source.url} 
                                                onLoadedMetadata={(e) => onAudioLoadedMetadata(e, source.id)} 
                                                onDurationChange={(e) => onAudioLoadedMetadata(e, source.id)}
                                                onError={() => onAudioError(source.id)}
                                                preload="metadata"
                                                className="hidden"
                                                referrerPolicy="no-referrer"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        </div>

                    {/* 新規スケジュール登録エリア */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2 border-b dark:border-gray-700 pb-2">
                            <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg dark:bg-indigo-900 dark:text-indigo-300"><IconClock /></span>
                            ステップ 2: スケジュール追加
                        </h2>
                        {/* 修正: grid-cols-12 に変更 */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="md:col-span-4">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">名前 (例: 朝の会)</label>
                                <input 
                                    type="text" 
                                    value={newName} 
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    placeholder="チャイム名を入力" 
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">時間</label>
                                <input 
                                    type="time" 
                                    value={newTime} 
                                    onChange={(e) => setNewTime(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-base" 
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">チャイム音</label>
                                <select 
                                    value={newAudioId} 
                                    onChange={(e) => setNewAudioId(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                >
                                    {audioSources.map(source => (
                                        <option key={source.id} value={source.id}>{source.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-3 w-full">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">タイプ</label>
                                <div className="flex rounded-md shadow-sm">
                                    <button onClick={() => setNewScheduleType('weekly')} className={`px-4 py-2 text-sm font-medium rounded-l-md flex-1 transition ${newScheduleType === 'weekly' ? 'bg-indigo-600 text-white z-10' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'}`}>毎週</button>
                                    <button onClick={() => setNewScheduleType('date')} className={`px-4 py-2 text-sm font-medium rounded-r-md flex-1 transition ${newScheduleType === 'date' ? 'bg-indigo-600 text-white z-10' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 -ml-px'}`}>日付指定</button>
                                </div>
                            </div>

                            {newScheduleType === 'weekly' ? (
                                <div className="md:col-span-4 w-full">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">曜日</label>
                                    <div className="flex justify-between gap-1">
                                        {DAYS_OF_WEEK.map((day) => (
                                            <button
                                                key={day.id}
                                                onClick={() => toggleDay(day.id)}
                                                className={`
                                                    w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors
                                                    ${newDays.includes(day.id) 
                                                        ? 'bg-indigo-600 text-white' 
                                                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-400 hover:border-indigo-400 dark:hover:border-indigo-400'}
                                                `}
                                                title={`${day.label}曜日`}
                                            >
                                                {day.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="md:col-span-4 w-full">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">日付</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <IconCalendar className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <input 
                                            type="date" 
                                            value={newSpecificDate} 
                                            onChange={(e) => setNewSpecificDate(e.target.value)}
                                            className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-base" 
                                        />
                                    </div>
                                </div>
                            )}

                            {isSetSinkIdSupported && audioDevices.length > 0 && (
                                <div className="md:col-span-4">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">出力デバイス</label>
                                    <select 
                                        value={newSinkId} 
                                        onChange={(e) => setNewSinkId(e.target.value)}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                    >
                                        <option value="default">全体設定に従う</option>
                                        {audioDevices.map(device => (
                                            <option key={device.deviceId} value={device.deviceId}>
                                                {device.label || `スピーカー ${device.deviceId.substring(0, 8)}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="md:col-span-4 w-full">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">音量: {Math.round(newVolume * 100)}%</label>
                                <div className="flex items-center gap-3">
                                    <IconVolume2 className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    <input 
                                        type="range" min="0" max="1.5" step="0.01" value={newVolume} onChange={(e) => setNewVolume(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                                    />
                                    <button 
                                        onClick={() => setNewVolume(1)} 
                                        className="text-xs bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition flex-shrink-0"
                                        title="音量を100%に戻す"
                                    >
                                        リセット
                                    </button>
                                </div>
                            </div>

                            <div className="md:col-span-12 mt-4">
                                <button 
                                    onClick={addSchedule}
                                    className={`w-full py-2 px-4 rounded-lg font-bold text-white transition bg-green-600 hover:bg-green-700 shadow-md`}
                                >
                                    + スケジュールに追加
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* スケジュール一覧 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                        <div className="flex items-center justify-between mb-4 border-b dark:border-gray-700 pb-2">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg dark:bg-indigo-900 dark:text-indigo-300"><IconCalendar /></span>
                                ステップ 3: 登録済みスケジュール
                            </h2>
                            <div className="flex gap-2">
                                <button onClick={() => importInputRef.current.click()} className="text-xs bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition flex items-center gap-1" title="スケジュールをインポート">
                                    <IconImport className="w-3 h-3" /> インポート
                                </button>
                                <input type="file" accept=".json" onChange={handleImport} ref={importInputRef} className="hidden" />
                                <button onClick={handleExport} className="text-xs bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center gap-1" title="スケジュールをエクスポート">
                                    <IconExport className="w-3 h-3" /> エクスポート
                                </button>
                            </div>
                        </div>

                        {schedules.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <p>登録されているスケジュールはありません。</p>
                                <p className="text-sm mt-1">上のフォームから新しいスケジュールを追加してください。</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {schedules.sort((a, b) => a.time.localeCompare(b.time)).map((schedule) => (
                                    <div 
                                        key={schedule.id} 
                                        className={`
                                            p-3 rounded-lg border transition-all duration-300 flex items-center gap-3
                                            ${schedule.enabled ? 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600' : 'bg-gray-100 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-60'}
                                        `}
                                    >
                                        {/* トグルスイッチ */}
                                        <button onClick={() => toggleSchedule(schedule.id)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${schedule.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} title={schedule.enabled ? '無効にする' : '有効にする'}>
                                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${schedule.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>

                                        {/* スケジュール情報 */}
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex items-baseline gap-3">
                                                <span className="text-xl font-mono font-bold text-gray-800 dark:text-gray-100">{schedule.time}</span>
                                                <span className="font-bold text-indigo-700 dark:text-indigo-300 truncate">{schedule.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                <span className="truncate flex items-center gap-1"><IconMusic className="w-3 h-3" />{(audioSources.find(s => s.id === schedule.audioId) || {name: '未設定'}).name}</span>
                                                <span className="flex-shrink-0">|</span>
                                                {isSetSinkIdSupported && (
                                                    <span className="flex items-center gap-1" title={`出力先: ${(audioDevices.find(d => d.deviceId === schedule.sinkId) || {label: '全体設定に従う'}).label}`}>
                                                        <IconSpeaker className="w-3 h-3" />
                                                        <span className="truncate max-w-[100px]">
                                                            {(audioDevices.find(d => d.deviceId === schedule.sinkId) || {label: '全体設定'}).label}
                                                        </span>
                                                    </span>
                                                )}
                                                {(schedule.scheduleType || 'weekly') === 'weekly' ? (
                                                    <div className="flex gap-1 ml-2">
                                                        {DAYS_OF_WEEK.map(day => (
                                                            <span key={day.id} className={`font-bold w-4 h-4 flex items-center justify-center rounded-full ${schedule.days.includes(day.id) ? (day.color) : 'text-gray-300 dark:text-gray-600'}`}>{day.label}</span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 font-semibold text-purple-700 dark:text-purple-300">
                                                        <IconCalendar className="w-3 h-3" />
                                                        <span>{schedule.specificDate}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 操作ボタン */}
                                        <div className="flex items-center">
                                            <button onClick={() => playChime(schedule)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition dark:text-indigo-400 dark:hover:bg-indigo-900" title="テスト再生"><IconPlay /></button>
                                            <button onClick={() => duplicateSchedule(schedule.id)} className="p-2 text-gray-500 hover:bg-blue-100 rounded-full transition dark:text-gray-400 dark:hover:bg-blue-900" title="コピー"><IconCopy /></button>
                                            <button onClick={() => openEditModal(schedule)} className="p-2 text-gray-500 hover:bg-blue-100 rounded-full transition dark:text-gray-400 dark:hover:bg-blue-900" title="編集"><IconEdit /></button>
                                            <button onClick={() => deleteSchedule(schedule.id)} className="p-2 text-gray-500 hover:bg-red-100 rounded-full transition dark:text-gray-400 dark:hover:bg-red-900" title="削除"><IconTrash /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
                )}

                {/* 編集モーダル */}
                {editingSchedule && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
                            <div className="p-4 border-b dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">スケジュールの編集</h3>
                            </div>
                            <div className="p-6 space-y-4">
                                {/* 名前 */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">名前</label>
                                    <input type="text" value={editingSchedule.name} onChange={(e) => setEditingSchedule({...editingSchedule, name: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded" />
                                </div>
                                {/* 時間 */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">時間</label>
                                    <input type="time" value={editingSchedule.time} onChange={(e) => setEditingSchedule({...editingSchedule, time: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded font-mono" />
                                </div>
                                {/* チャイム音 */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">チャイム音</label>
                                    <select 
                                        value={editingSchedule.audioId || 'default'} 
                                        onChange={(e) => setEditingSchedule({...editingSchedule, audioId: e.target.value})}
                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded"
                                    >
                                        {audioSources.map(source => (
                                            <option key={source.id} value={source.id}>{source.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* 出力デバイス */}
                                {isSetSinkIdSupported && audioDevices.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">出力デバイス</label>
                                        <select 
                                            value={editingSchedule.sinkId || 'default'} 
                                            onChange={(e) => setEditingSchedule({...editingSchedule, sinkId: e.target.value})}
                                            className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded"
                                        >
                                            <option value="default">全体設定に従う</option>
                                            {audioDevices.map(device => (
                                                <option key={device.deviceId} value={device.deviceId}>
                                                    {device.label || `スピーカー ${device.deviceId.substring(0, 8)}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {/* タイプ */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">タイプ</label>
                                    <div className="flex rounded-md shadow-sm">
                                        <button onClick={() => setEditingSchedule({...editingSchedule, scheduleType: 'weekly'})} className={`px-4 py-2 text-sm font-medium rounded-l-md flex-1 transition ${editingSchedule.scheduleType === 'weekly' ? 'bg-indigo-600 text-white z-10' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'}`}>
                                            毎週
                                        </button>
                                        <button onClick={() => setEditingSchedule({...editingSchedule, scheduleType: 'date'})} className={`px-4 py-2 text-sm font-medium rounded-r-md flex-1 transition ${editingSchedule.scheduleType === 'date' ? 'bg-indigo-600 text-white z-10' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600 -ml-px'}`}>
                                            日付指定
                                        </button>
                                    </div>
                                </div>
                                {/* 音量 */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">音量: {Math.round(editingSchedule.volume * 100)}%</label>
                                    <div className="flex items-center gap-3">
                                        <IconVolume2 className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                        <input 
                                            type="range" min="0" max="1.5" step="0.01" 
                                            value={editingSchedule.volume} 
                                            onChange={(e) => setEditingSchedule({...editingSchedule, volume: parseFloat(e.target.value)})}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                        />
                                        <button 
                                            onClick={() => setEditingSchedule({...editingSchedule, volume: 1})} 
                                            className="text-xs bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 px-2 py-1 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition flex-shrink-0"
                                            title="音量を100%に戻す"
                                        >
                                            リセット
                                        </button>
                                    </div>
                                </div>
                                {/* 曜日 or 日付 */}
                                {editingSchedule.scheduleType === 'weekly' ? (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">曜日</label>
                                        <div className="flex justify-between gap-1">
                                            {DAYS_OF_WEEK.map((day) => (
                                                <button
                                                    key={day.id}
                                                    onClick={() => {
                                                        const currentDays = editingSchedule.days || [];
                                                        const newDays = currentDays.includes(day.id)
                                                            ? currentDays.filter(d => d !== day.id)
                                                            : [...currentDays, day.id].sort();
                                                        setEditingSchedule({...editingSchedule, days: newDays});
                                                    }}
                                                    className={`
                                                        w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center transition-colors
                                                        ${(editingSchedule.days || []).includes(day.id) 
                                                            ? 'bg-indigo-600 text-white' 
                                                            : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:border-indigo-400'}
                                                    `}
                                                    title={`${day.label}曜日`}
                                                >
                                                    {day.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">日付</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><IconCalendar className="w-4 h-4 text-gray-400" /></div>
                                            <input 
                                                type="date" 
                                                value={editingSchedule.specificDate} 
                                                onChange={(e) => setEditingSchedule({...editingSchedule, specificDate: e.target.value})}
                                                className="w-full pl-10 p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded font-mono" 
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-2 rounded-b-lg">
                                <button 
                                    onClick={closeEditModal}
                                    className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 transition"
                                >
                                    キャンセル
                                </button>
                                <button 
                                    onClick={updateSchedule}
                                    className="px-4 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700 transition"
                                >
                                    保存
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 注意事項モーダル */}
                {isWarningModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeWarningModal}>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                                    <IconAlertTriangle />
                                    <span>注意事項</span>
                                </h3>
                            </div>
                            <div className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
                                <p>「ファイルから追加」でアップロードした音声ファイルは、ブラウザのセキュリティ上の仕様により、ページを更新（リロード）するとリセットされます。</p>
                                <p>音源設定を永続的に保存したい場合は、「URLから追加」機能をご利用ください。</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-2 rounded-b-lg">
                                <button onClick={closeWarningModal} className="px-4 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700 transition">
                                    閉じる
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 使い方モーダル */}
                {isHelpModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={closeHelpModal}>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    <IconHelpCircle />
                                    <span>使い方</span>
                                </h3>
                            </div>
                            <div className="p-6 space-y-6 text-gray-700 dark:text-gray-300 overflow-y-auto">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                    <h4 className="font-bold text-indigo-700 dark:text-indigo-300">はじめに</h4>
                                    <p className="text-sm mt-1">このアプリケーションは、ブラウザ上で動作します。チャイムを鳴らすには、このページを開いたままにしておく必要があります。PCがスリープしたり、ブラウザを閉じるとチャイムは鳴りません。<br/><span className="text-xs text-red-500 dark:text-red-400 font-bold">※誤操作防止のため、タブを閉じたりリロードしようとすると確認メッセージが表示されます。</span></p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400">ステップ1: チャイム音の設定</h4>
                                    <p className="text-sm">まず、チャイムとして鳴らす音声ファイルを登録します。音源の登録には2つの方法があります。</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                                        <li>
                                            <strong>URLから追加 (推奨):</strong><br />
                                            Web上の音声ファイル(MP3など)のURLや、Google Drive, Dropbox, OneDriveの共有リンクを貼り付けて登録します。この方法で追加した音源は設定がブラウザに保存され、次回以降も利用できます。
                                        </li>
                                        <li>
                                            <strong>ファイルから追加 (一時的):</strong><br />
                                            お使いのPCから音声ファイルを直接アップロードして使用します。手軽ですが、この方法で追加した音源はページを再読み込みすると消えてしまうため、ご注意ください。
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400">ステップ2: スケジュール追加</h4>
                                    <p className="text-sm">次に、「いつ」「どの音を」「どのように」鳴らすかを設定します。</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                                        <li><strong>名前・時間・チャイム音:</strong> スケジュールの目的（例:「始業チャイム」）、鳴らす時刻、ステップ1で登録した音源をそれぞれ設定します。</li>
                                        <li><strong>タイプ:</strong> 「毎週」を選ぶと指定した曜日に毎週チャイムが鳴ります。「日付指定」を選ぶと、特定の日付に一度だけ鳴らすことができます（例: 始業式、終業式など）。</li>
                                        <li><strong>出力デバイス:</strong> 特定のスピーカーから音を出したい場合に設定します。「全体設定に従う」にすると、下で説明する「全体デバイス設定」が適用されます。</li>
                                        <li><strong>音量:</strong> スケジュールごとに個別の音量を0%〜150%の範囲で細かく調整できます。</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400">ステップ3: 登録済みスケジュールの管理</h4>
                                    <p className="text-sm">登録したスケジュールは一覧で確認・管理できます。</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                                        <li><strong>有効/無効スイッチ:</strong> 左側のスイッチで、スケジュールを削除せずに一時的にON/OFFできます。長期休暇中などに便利です。</li>
                                        <li><strong>操作アイコン:</strong> 右側の各アイコンで、<IconPlay className="inline w-4 h-4" />テスト再生、<IconCopy className="inline w-4 h-4" />複製、<IconEdit className="inline w-4 h-4" />編集、<IconTrash className="inline w-4 h-4" />削除 が行えます。</li>
                                        <li><strong>インポート/エクスポート:</strong> 作成した全スケジュールを一つのファイルとして書き出し（エクスポート）、別のPCで読み込む（インポート）ことができます。バックアップや、複数環境での設定共有に役立ちます。</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400">補足: 全体デバイス設定</h4>
                                    <p className="text-sm">スケジュール一覧の上にある「全体デバイス設定」では、アプリケーション全体の基本的な音声出力先（スピーカー）を設定できます。</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                                        <li>PCに複数のスピーカーや仮想オーディオデバイスが接続されている場合、ここから出力先を選択できます。</li>
                                        <li>
                                            この機能を利用するには、ブラウザにマイクへのアクセスを許可する必要があります。<br />
                                            <strong>なぜマイクの許可が必要？</strong><br />
                                            セキュリティ上の理由から、最近のブラウザはWebサイトがPCに接続されたデバイス（スピーカーやマイク）の詳しい名前を勝手に取得できないように設計されています。
                                            しかし、一度ユーザーがマイクの使用を「許可」すると、ブラウザはこのサイトを信頼し、接続されているスピーカーの一覧（名前を含む）を正しく表示できるようになります。<br />
                                            <span className="text-xs text-gray-500 dark:text-gray-400">※このアプリはスピーカー一覧の取得目的でのみ許可を求めており、マイクの音声を録音・送信することはありません。</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400">GitHub連携機能 (高度な機能)</h4>
                                    <p className="text-sm">GitHubアカウントをお持ちの方は、設定データをクラウドに保存できます。</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm pl-4">
                                        <li><strong>設定のバックアップ・同期:</strong> スケジュールと音源リストをGitHubリポジトリに保存し、複数のPCで共有できます。</li>
                                        <li><strong>音源の直接アップロード:</strong> 連携設定画面の「音源ファイルのアップロード」エリアにファイルをドラッグ＆ドロップすると、GitHubに直接アップロードされ、自動的にアプリのリストに追加されます。URLを手動で登録する手間が省け、データも永続化されます。</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-2 rounded-b-lg sticky bottom-0">
                                <button onClick={closeHelpModal} className="px-4 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700 transition">
                                    閉じる
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* GitHub連携モーダル */}
                {isGithubModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setIsGithubModalOpen(false)}>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    <IconGithub />
                                    <span>GitHub連携設定</span>
                                </h3>
                                <button onClick={() => setIsGithubHelpModalOpen(true)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                                    トークンの取得方法
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    GitHubリポジトリに音源設定（ファイルデータ含む）を保存・読み込みします。<br/>
                                    <span className="text-xs text-red-500">※トークンはブラウザに保存されます。共用PCでは注意してください。</span>
                                </p>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Personal Access Token</label>
                                    <input type="password" placeholder="ghp_..." value={githubConfig.token} onChange={(e) => setGithubConfig({...githubConfig, token: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded text-sm" />
                                    <div className="flex items-center mt-2">
                                        <input 
                                            type="checkbox" 
                                            id="saveCredentials" 
                                            checked={githubConfig.saveCredentials} 
                                            onChange={(e) => setGithubConfig({...githubConfig, saveCredentials: e.target.checked})} 
                                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <label htmlFor="saveCredentials" className="ml-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                                            認証情報（トークン）をブラウザに保存する
                                        </label>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Owner (ユーザー名 / Username)</label>
                                        <input type="text" placeholder="ExampleUser" value={githubConfig.owner} onChange={(e) => setGithubConfig({...githubConfig, owner: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">Repository (リポジトリ名)</label>
                                        <input type="text" placeholder="my-repo" value={githubConfig.repo} onChange={(e) => setGithubConfig({...githubConfig, repo: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-1">File Path (保存先パス)</label>
                                    <input type="text" placeholder="data/schedules.json" value={githubConfig.path} onChange={(e) => setGithubConfig({...githubConfig, path: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded text-sm" />
                                </div>
                                
                                <div className="border-t dark:border-gray-700 pt-4 mt-2">
                                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                                        <IconUpload className="w-4 h-4" /> 音源ファイルのアップロード
                                    </h4>
                                    <div className="mb-2">
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Audio Folder Path (音源保存先フォルダ)</label>
                                        <input type="text" placeholder="audio/" value={githubConfig.audioPath || ''} onChange={(e) => setGithubConfig({...githubConfig, audioPath: e.target.value})} className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded text-sm" />
                                    </div>
                                    
                                    <div
                                        onDragOver={handleGithubDragOver}
                                        onDragLeave={handleGithubDragLeave}
                                        onDrop={handleGithubDrop}
                                        className={`
                                            border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
                                            ${isGithubDragging 
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/30' 
                                                : 'border-gray-300 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-400 bg-gray-50 dark:bg-gray-700/50'}
                                        `}
                                    >
                                        {isUploading ? (
                                            <div className="text-green-600 font-bold animate-pulse">アップロード中...</div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                                                <IconUpload className={`w-8 h-8 ${isGithubDragging ? 'text-green-600' : 'text-gray-400'}`} />
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">ここに音源ファイルをドロップ</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">指定フォルダにアップロードし、リストに追加します</span>
                                            </div>
                                        )}
                                        <input type="file" accept="audio/*" onChange={(e) => handleGithubAudioUpload(e.target.files)} className="hidden" multiple />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-2 rounded-b-lg">
                                <button onClick={() => setIsGithubModalOpen(false)} className="px-4 py-2 rounded text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 transition text-sm">
                                    閉じる
                                </button>
                                <button onClick={handleGithubLoad} className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition text-sm flex items-center gap-1">
                                    <IconImport className="w-4 h-4" /> 読み込み
                                </button>
                                <button onClick={handleGithubSave} className="px-4 py-2 rounded text-white bg-green-600 hover:bg-green-700 transition text-sm flex items-center gap-1">
                                    <IconExport className="w-4 h-4" /> 保存 (Upload)
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* GitHubヘルプモーダル (z-indexを高く設定) */}
                {isGithubHelpModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4" style={{ zIndex: 60 }} onClick={() => setIsGithubHelpModalOpen(false)}>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <div className="p-4 border-b dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">GitHubトークンの取得手順</h3>
                            </div>
                            <div className="p-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">アカウントをお持ちでない場合</h4>
                                    <p className="mb-2 text-xs">GitHubは英語サイトですが、以下の手順で無料で作成できます。</p>
                                    <ol className="list-decimal list-inside space-y-1 text-xs mb-3 text-gray-600 dark:text-gray-400">
                                        <li><a href="https://github.com/signup" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-bold">作成ページ(Sign up)</a>へアクセス</li>
                                        <li><strong>Email</strong>: メールアドレスを入力</li>
                                        <li><strong>Password</strong>: パスワードを設定 (15文字以上 または 8文字以上+数字)</li>
                                        <li><strong>Username</strong>: ユーザー名を設定 (英数字 / ※これが設定画面の Owner (ユーザー名) になります)</li>
                                        <li><strong>Verify</strong>: パズルを解いてロボット認証し、メールの数字コードを入力</li>
                                    </ol>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        ※アカウントを作らない場合は、Google Drive等に音源を保存し「URLから追加」をご利用ください。
                                    </p>
                                </div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 border-b dark:border-gray-600 pb-2">リポジトリの作成手順 (保存場所を作る)</h4>
                                <ol className="list-decimal list-inside space-y-1 text-xs mb-4 text-gray-600 dark:text-gray-400">
                                    <li>画面右上の <strong>「+」</strong> アイコンから <strong>New repository</strong> を選択</li>
                                    <li><strong>Repository name</strong> に名前を入力（例: <code>school-chime-data</code> / ※これが設定画面の Repository (リポジトリ名) になります）</li>
                                    <li><strong>Public</strong> (公開) か <strong>Private</strong> (非公開) を選択し、<strong>Create repository</strong> をクリック</li>
                                </ol>
                                <h4 className="font-bold text-gray-800 dark:text-gray-200 border-b dark:border-gray-600 pb-2">トークン取得手順 (アカウントをお持ちの方)</h4>
                                <ol className="list-decimal list-inside space-y-3">
                                    <li>GitHubにログインし、画面右上のプロフィール画像をクリックして <strong>Settings</strong> を開きます。</li>
                                    <li>左サイドバーの一番下にある <strong>Developer settings</strong> をクリックします。</li>
                                    <li><strong>Personal access tokens</strong> &gt; <strong>Tokens (classic)</strong> を選択します。</li>
                                    <li><strong>Generate new token (classic)</strong> をクリックします。</li>
                                    <li><strong>Note</strong> にわかりやすい名前（例: School Chime App）を入力します。</li>
                                    <li><strong>Select scopes</strong> で、保存先が公開リポジトリなら <strong>public_repo</strong>、非公開なら <strong>repo</strong> にチェックを入れます。</li>
                                    <li>画面下の <strong>Generate token</strong> をクリックします。</li>
                                    <li>表示されたトークン（<code>ghp_...</code>）をコピーして、アプリの設定欄に貼り付けてください。</li>
                                </ol>
                                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded text-xs text-yellow-800 dark:text-yellow-200">
                                    <p>※トークンは一度しか表示されません。コピーし忘れた場合は再生成してください。</p>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-end rounded-b-lg">
                                <button onClick={() => setIsGithubHelpModalOpen(false)} className="px-4 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700 transition">
                                    閉じる
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
