/*
  req.body.id,
                req.body.name,
                req.body.body,
  */
export interface Message {
  id: number;
  name: string;
  body: string;
  socketId: string;
}
