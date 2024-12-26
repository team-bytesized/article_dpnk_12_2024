# article_dprk_12_2024

This repo contains all files mentioned in https://team-bytesized.github.io/articles/malware/beavertail_invisbleferret.html and INSERT MEDIUM LINK
All files that contains _deob in the name, are the deobfuscated version of some obfuscated file.

This is a breakdown of the files
```
.
├── beavertail
│   ├── infected_test.js -> Initial test file with the malware
│   ├── beavertail.js -> Malware extracted from test file (beavertail)
│   └── beavertail_deob.js
└── invisibleferret
    ├── deob.py -> script used to deobfuscate python files
    ├── main.py -> original script donwloaded from beavertail (invisible ferret)
    ├── main_deob.py
    ├── browser_obfuscated.py -> original browser stealer module of invisible ferret
    ├── browser_deob.py 
    ├── mclip_deob.py
    ├── mclip_obfuscated.py
    ├── payload_deob.py
    ├── payload_obfuscated.py
    ├── rat.py
    └── any.py
```