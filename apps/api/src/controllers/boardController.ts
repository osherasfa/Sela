const getBoard = async (req: any, res: any) => {
  const { boardId } = req.params;
  res.json({ message: `Here ${boardId} board` });
};

export { getBoard };