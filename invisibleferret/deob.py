import zlib
import base64
import sys


with open(sys.argv[1],'r') as f:
	pl = f.read()

def decompress(pl):
  try:
    pl = pl[::-1]
    pl = base64.b64decode(pl)
    pl = zlib.decompress(pl)
    return pl
  except:
    print("ERROR")
    print(pl)
    exit()

cnt = 1

while True:

    pl = decompress(pl)

    if (pl[0:9] == b"exec((_)("):
        pl = pl[11:-3]
    else:
        print(pl.decode())
        break

    cnt += 1
