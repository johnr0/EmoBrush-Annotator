import torch

import torch.nn as nn

from torch.nn.utils.rnn import pack_padded_sequence, pad_packed_sequence

class EmoSketchModel(nn.Module):
  def __init__(self, input_size=4, hidden_size=64, num_layers=2, dropout=0.1, label_num=6):
    super(EmoSketchModel, self).__init__()
    self.hidden_size = hidden_size
    self.lstm = nn.LSTM(
        input_size = input_size, 
        hidden_size = self.hidden_size, 
        num_layers = num_layers,
        batch_first = True,
        bidirectional=True,
      )
    self.drop = nn.Dropout(p=dropout)
    self.fc = nn.Linear(self.hidden_size, label_num)
  
  def forward(self, input):
    input_len = len(input)
    output, _ = self.lstm(input)
    output = output[range(len(output)), input_len - 1, :self.hidden_size]
    # print(output.shape)
    # out_forward = output[range(len(output)), input_len - 1, :self.hidden_size]
    # out_reverse = output[:, 0, self.hidden_size:]
    # out_reduced = torch.cat((out_forward, out_reverse), 1)
    fea = self.drop(output)

    fea = self.fc(fea)
    fea = torch.squeeze(fea, 1)
    out = torch.tanh(fea)
    # print(out)
    return out