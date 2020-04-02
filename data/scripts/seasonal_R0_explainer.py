import matplotlib.pyplot as plt
import numpy as np

fig = plt.figure(figsize=(12,6))
fs = 16

time = np.arange(12)+0.5 - 3

R0 = 1.8
eps = 0.4
peak = 0

plt.plot(time, R0*(1+eps*np.cos(2*np.pi*(time-peak)/12)), lw=4)

plt.plot(time, R0*np.ones_like(time), lw=3, c='#AAAAAA')
plt.plot([0,0], [0,R0*(1+eps)+0.1], lw=3, c='#AAAAAA')
plt.text(time[0], R0*0.9, "Average R0", fontsize=fs)
plt.text(peak+0.1, R0*(1+eps)+0.1, "Peak transmission", fontsize=fs)
plt.ylim([0.0, R0*(1.2+eps)])
plt.ylabel("Seasonal R0", fontsize=fs)
plt.xticks([time[i] for i in [0,3,6,9]], ['Oct', 'Jan', 'Apr', 'Jul'])
plt.tick_params(labelsize=fs)
plt.savefig('src/assets/img/seasonal_illustration.svg')
