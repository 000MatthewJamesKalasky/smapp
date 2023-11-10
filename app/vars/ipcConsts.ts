enum IpcChannel {
  PRINT = 'PRINT',
  CLOSING_APP = 'CLOSING_APP',
  TOGGLE_AUTO_START = 'TOGGLE_AUTO_START',
  IS_AUTO_START_ENABLED_REQUEST = 'IS_AUTO_START_ENABLED_REQUEST',
  SET_NODE_PORT = 'SET_NODE_PORT',
  // Theme
  GET_OS_THEME_COLOR = 'GET_OS_THEME_COLOR',
  OPEN_BROWSER_VIEW = 'OPEN_BROWSER_VIEW',
  DESTROY_BROWSER_VIEW = 'DESTROY_BROWSER_VIEW',
  SEND_THEME_COLOR = 'SEND_THEME_COLOR',

  // Networks
  LIST_NETWORKS = 'LIST_NETWORKS',
  SWITCH_NETWORK = 'SWITCH_NETWORK',
  REQUEST_SWITCH_NETWORK = 'REQUEST_SWITCH_NETWORK',
  REQUEST_SWITCH_API = 'REQUEST_SWITCH_API',
  // Public services
  LIST_PUBLIC_SERVICES = 'LIST_PUBLIC_SERVICES',
  // Switching modes (Wallet / Local node)
  SWITCH_API_PROVIDER = 'SWITCH_API_PROVIDER',
  /** *********************************************************************** API 2.0 ********************************************************** */
  // Smesher Service calls
  SMESHER_SET_SETTINGS_AND_STARTUP_STATUS = 'SMESHER_SET_SETTINGS_AND_STARTUP_STATUS',
  SMESHER_SEND_SMESHING_CONFIG = 'SMESHER_SEND_SMESHING_CONFIG',
  SMESHER_SELECT_POST_FOLDER = 'SMESHER_SELECT_POST_FOLDER',
  SMESHER_START_SMESHING = 'SMESHER_START_SMESHING',
  SMESHER_STOP_SMESHING = 'SMESHER_STOP_SMESHING',
  SMESHER_GET_COINBASE = 'SMESHER_GET_COINBASE',
  SMESHER_GET_MIN_GAS = 'SMESHER_GET_MIN_GAS',
  SMESHER_GET_ESTIMATED_REWARDS = 'SMESHER_GET_ESTIMATED_REWARDS',
  REQUEST_SETUP_COMPUTE_PROVIDERS = 'REQUEST_SETUP_COMPUTE_PROVIDERS',

  SMESHER_SET_SETUP_COMPUTE_PROVIDERS = 'SMESHER_SET_SETUP_COMPUTE_PROVIDERS',
  SMESHER_POST_DATA_CREATION_PROGRESS = 'SMESHER_POST_DATA_CREATION_PROGRESS',
  SMESHER_METADATA_INFO = 'SMESHER_METADATA_INFO',
  SMESHER_UPDATE_PROVING_OPTS = 'SMESHER_UPDATE_PROVING_OPTS',
  // Wallet Manager
  W_M_GET_GLOBAL_STATE_HASH = 'W_M_GET_GLOBAL_STATE_HASH',
  W_M_GET_CURRENT_LAYER = 'W_M_GET_CURRENT_LAYER',
  W_M_CREATE_WALLET = 'W_M_CREATE_WALLET',
  W_M_UNLOCK_WALLET = 'W_M_UNLOCK_WALLET',
  W_M_BACKUP_WALLET = 'W_M_BACKUP_WALLET',
  W_M_ADD_WALLET_PATH = 'W_M_ADD_WALLET_PATH',
  W_M_UPDATE_WALLET_META = 'W_M_UPDATE_WALLET_META',
  W_M_CLOSE_WALLET = 'W_M_CLOSE_WALLET',
  W_M_CHANGE_PASSWORD = 'W_M_CHANGE_PASSWORD',
  W_M_RENAME_ACCOUNT = 'W_M_RENAME_ACCOUNT',
  W_M_CREATE_NEW_ACCOUNT = 'W_M_CREATE_NEW_ACCOUNT',
  W_M_ADD_CONTACT = 'W_M_ADD_CONTACT',
  W_M_REMOVE_CONTACT = 'W_M_REMOVE_CONTACT',
  READ_WALLET_FILES = 'READ_WALLET_FILES',
  W_M_SHOW_FILE_IN_FOLDER = 'W_M_SHOW_FILE_IN_FOLDER',
  W_M_SHOW_DELETE_FILE = 'W_M_SHOW_DELETE_FILE',
  W_M_WIPE_OUT = 'W_M_WIPE_OUT',
  W_M_SIGN_MESSAGE = 'W_M_SIGN_MESSAGE',
  W_M_GET_GET_ACCOUNT_REWARDS = 'W_M_GET_GET_ACCOUNT_REWARDS',
  W_M_GET_TX_MAX_GAS = 'W_M_PARSE_TX',
  W_M_SPAWN_TX = 'W_M_SPAWN_TX',
  W_M_SEND_TX = 'W_M_SEND_TX',
  W_M_UPDATE_TX_NOTE = 'W_M_UPDATE_TX_NOTE',
  // Transactions Manager
  T_M_UPDATE_ACCOUNT = 'T_M_UPDATE_ACCOUNT',
  T_M_UPDATE_TXS = 'T_M_UPDATE_TXS',
  T_M_ADD_TX = 'T_M_ADD_TX',
  T_M_UPDATE_REWARDS = 'T_M_UPDATE_REWARDS',
  T_M_ADD_REWARD = 'T_M_ADD_REWARD',
  // Node Manager
  N_M_GET_VERSION_AND_BUILD = 'N_M_GET_VERSION_AND_BUILD',
  N_M_SET_NODE_STATUS = 'N_M_SET_NODE_STATUS',
  N_M_SET_NODE_ERROR = 'N_M_SET_NODE_ERROR',
  N_M_RESTART_NODE = 'N_M_RESTART_NODE',
  N_M_NODE_STARTUP_STATUS = 'N_M_NODE_STARTUP_STATUS',
  PROMPT_CHANGE_DATADIR = 'PROMPT_CHANGE_DATADIR',
  // Auto Updater
  AU_ERROR = 'AU_ERROR',
  AU_FORCE_UPDATE_STARTED = 'AU_FORCE_UPDATE_STARTED',
  AU_CHECK_UPDATES = 'AU_CHECK_UPDATES',
  AU_NO_UPDATES_AVAILABLE = 'AU_NO_UPDATES_AVAILABLE',
  AU_AVAILABLE = 'AU_AVAILABLE',
  AU_REQUEST_DOWNLOAD = 'AU_REQUEST_DOWNLOAD',
  AU_DOWNLOAD_STARTED = 'AU_DOWNLOAD_STARTED',
  AU_DOWNLOAD_PROGRESS = 'AU_DOWNLOAD_PROGRESS',
  AU_DOWNLOADED = 'AU_DOWNLOAD_COMPLETE',
  AU_REQUEST_INSTALL = 'AU_REQUEST_INSTALL',
  AU_DOWNLOAD_MANUALLY = 'AU_DOWNLOAD_MANUALLY',
  WALLET_ACTIVATED = 'WALLET_ACTIVATED',
  GET_NODE_AND_APP_LOGS = 'GET_NODE_AND_APP_LOGS',
  NEW_WARNING = 'NEW_WARNING',
  RUN_BENCHMARKS = 'RUN_BENCHMARKS',
  SEND_BENCHMARK_RESULTS = 'SEND_BENCHMARK_RESULTS',
  NODE_INSTALLED_LIBRARIES = 'NODE_INSTALLED_LIBRARIES',
}

export default IpcChannel;
