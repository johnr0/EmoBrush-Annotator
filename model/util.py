import pandas as pd
import json
import numpy as np
import torch

class EarlyStopping(object):
    def __init__(self, mode='max', min_delta=0, patience=50, percentage=False):
        self.mode = mode
        self.min_delta = min_delta
        self.patience = patience
        self.best = None
        self.num_bad_epochs = 0
        self.is_better = None
        self._init_is_better(mode, min_delta, percentage)

        if patience == 0:
            self.is_better = lambda a, b: True
            self.step = lambda a: False

    def step(self, metrics, name, model):
        if self.best is None:
            self.best = metrics
            torch.save(model, name)
            return False

        if np.isnan(metrics):
            return True

        if self.is_better(metrics, self.best):
            self.num_bad_epochs = 0
            self.best = metrics
            torch.save(model, name)
        else:
            self.num_bad_epochs += 1

        if self.num_bad_epochs >= self.patience:
            print('terminating because of early stopping! Best perf:', self.best)
            return True

        return False

    def _init_is_better(self, mode, min_delta, percentage):
        if mode not in {'min', 'max'}:
            raise ValueError('mode ' + mode + ' is unknown!')
        if not percentage:
            if mode == 'min':
                self.is_better = lambda a, best: a < best - min_delta
            if mode == 'max':
                self.is_better = lambda a, best: a > best + min_delta
        else:
            if mode == 'min':
                self.is_better = lambda a, best: a < best - (
                            best * min_delta / 100)
            if mode == 'max':
                self.is_better = lambda a, best: a > best + (
                            best * min_delta / 100)
                



def pdstructure_class(d, batch_size, labels, device):
  lengths = []
  for r_idx, row in d.iterrows():
    datum = json.loads(row['Data'])
    lengths.append(len(datum))
  max_length = np.max(lengths)
  batches = []
  a_batch = []
  a_batch_label = []
  a_batch_mask = []
  for r_idx, row in d.iterrows():
    datum = json.loads(row['Data'])
    masks = [1]*len(datum)
    while len(datum)<max_length:
      datum.append([0,0,0,-1])
      masks.append(0)
    label_idx = labels.index(row['Emotion'])
    label = [0] * len(labels)
    label[label_idx]=1
    if len(a_batch)<batch_size:
      a_batch.append(datum)
      a_batch_label.append(label)
      a_batch_mask.append(masks)
    else:
      a_batch = torch.Tensor(a_batch).to(device)
      a_batch_label = torch.Tensor(a_batch_label).to(device)
      a_batch_mask = torch.Tensor(a_batch_mask).to(device)
      batches.append({'input':a_batch, 'label': a_batch_label, 'mask': a_batch_mask})
      a_batch = []
      a_batch_label = []
      a_batch_mask = []
    if r_idx == len(d)-1 and len(a_batch)!=0:
      a_batch = torch.Tensor(a_batch).to(device)
      a_batch_label = torch.Tensor(a_batch_label).to(device)
      a_batch_mask = torch.Tensor(a_batch_mask).to(device)
      batches.append({'input':a_batch, 'label': a_batch_label, 'mask': a_batch_mask})
      a_batch = []
      a_batch_label = []
      a_batch_mask = []
    # print(r_idx == len(d)-1)
  return batches