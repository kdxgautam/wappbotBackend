import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

from twocaptcha import TwoCaptcha

api_key="34c4bc29a7d7f813933968b6576d93b0"



solver = TwoCaptcha(api_key)




try:
    result = solver.normal(sys.argv[1])

except Exception as e:
    sys.stdout.flush()

else:
    print(str(result))
    sys.stdout.flush()




# try:
#     result = solver.normal('./captchas/downloadedimage.jpg')

# except Exception as e:
#     sys.exit(e)

# else:
#     sys.exit('result: ' + str(result))
