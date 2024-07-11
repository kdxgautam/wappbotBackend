import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

from twocaptcha import TwoCaptcha

api_key="f4d81fdcd882e3222634088f4b6857ef"



solver = TwoCaptcha(api_key)




# try:
#     result = solver.normal(sys.argv[1])

# except Exception as e:
#     sys.stdout.flush()

# else:
#     print(str(result))
#     sys.stdout.flush()




try:
    result = solver.normal('./captchas/downloadedimage.jpg')

except Exception as e:
    sys.exit(e)

else:
    sys.exit('result: ' + str(result))
