import sys
import numpy as np
import tensorflow
from tensorflow.keras.models import Model
from keras.models import Model
import neurokit2 as nk
import keras
import warnings

def get_prediction(data,hrv):
  sample = data.reshape(1,5006,12)
  hrv = hrv.to_numpy().reshape(1,14)
  X = [sample,hrv]
  ans = []
  for i in range(5):
    # give path for the model here
    #print(open('./Models/modelfoldhrv'+str(i+1)+'.h5'))
    model = keras.models.load_model('./PythonFiles/Models/modelfoldhrv'+str(i+1)+'.h5')
    ypred = model.predict(X)
    ans.append(ypred.round())
  n = max(ans, key = ans.count)
  if n==0:
    return "Post-Covid"
  else:
    return "Normal"
def hrv_ex(data):
  peaks, info = nk.ecg_peaks(data[:,1], sampling_rate=500)
  hrv_feature = nk.hrv_time(peaks, sampling_rate=500)
  hrv_feature = hrv_feature.dropna(axis='columns')
  return hrv_feature
# give location of csv file shared
sample = np.loadtxt(sys.argv[1])
hrv = hrv_ex(sample)
JSON=hrv.to_json()[0:-1]+',"Output":"'+get_prediction(sample,hrv)+'"}'
print(JSON)

