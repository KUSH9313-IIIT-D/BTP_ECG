import sys
import pandas as pd
import numpy as np
import neurokit2 as nk
filepath = sys.argv[1]
def hrv_ex(data):
  peaks, info = nk.ecg_peaks(data[:,1], sampling_rate=500)
  hrv_feature = nk.hrv_time(peaks, sampling_rate=500)
  hrv_feature = hrv_feature.dropna(axis='columns')
  return hrv_feature
sample = np.loadtxt(filepath)
h = hrv_ex(sample)

print(h.to_json())
