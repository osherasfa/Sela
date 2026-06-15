const getBoard = async (req, res) => {
    const { boardId } = req.params;
    res.json({ message: `Here ${boardId} board` });
};
export { getBoard };
//# sourceMappingURL=boardController.js.map