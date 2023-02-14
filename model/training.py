from model import EmoSketchModel
from util import EarlyStopping, pdstructure_class
from tqdm.auto import tqdm
from datasets import load_metric

import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd

device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
input_data_path = '../preprocess/emobrush_data.csv'
model_file_path = 'emosketch_lstm.pt'

# prepare data
data = pd.read_csv(input_data_path)

batch_size = 8
labels = ['happy', 'sad', 'fearful', 'surprised', 'disgusted', 'angry']
print(data.User.unique())
train = data[data['User']=='simple-fawn']
train = train.sample(n=len(train))
test = data[data['User']=='actual-lemur']
test = test.sample(n=len(test))

train_batches = pdstructure_class(train, batch_size, labels, device)
test_batches = pdstructure_class(test, batch_size, labels, device)

# specify the model
model = EmoSketchModel(num_layers=2, dropout=0).to(device)


optimizer = optim.Adam(model.parameters(), lr=0.0001)

epochs = 1000
num_training_steps = epochs * len(train_batches)
scheduler = optim.lr_scheduler.LinearLR(optimizer, start_factor=0.5, total_iters=4)

es =EarlyStopping(patience=1000)

model.to(device)
loss_function = nn.CrossEntropyLoss()

metric1 = load_metric("accuracy")


progress_bar = tqdm(range(num_training_steps))
for epoch in range(epochs):
  model.train()
  for train_batch in train_batches:
    outputs = model.forward(train_batch['input'])
    loss = loss_function(outputs, train_batch['label'])
    loss.backward()

    # # logits = outputs.logits
    # references = []
    # for row in train_batch['label']:
    #   references.append(list(row).index(1))
    # predictions = torch.argmax(outputs.logits, dim=-1)
    # metric1.add_batch(predictions=predictions, references=references)


    optimizer.step()
    scheduler.step()
    optimizer.zero_grad()
    progress_bar.update(1)
  model.eval()
  for test_batch in test_batches:
    with torch.no_grad():
      outputs = model.forward(test_batch['input'])

    # logits = outputs.logits
    predictions = torch.argmax(outputs, dim=-1)
    # loss = loss_function(outputs, train_batch['label'])
    references = []
    for row in test_batch['label']:
      references.append(list(row).index(1))
    
    # print(pre)
    # print(references, predictions)
    # metric1.add_batch(predictions=predictions, references=references)
    print(predictions, references)
    metric1.add_batch(predictions=predictions, references=references)

    
  
  m1 = metric1.compute()
  print('epoch', epoch,':', m1)
  if es.step(m1['accuracy'], model_file_path,model ):
      print('breaking')
      break

