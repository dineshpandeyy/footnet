router.post('/:id/join', async (req, res) => {
  try {
    const { userId, name, isRequest } = req.body;
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if user is already a member
    if (community.members.some(m => m.userId === userId)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    // For private communities, add to pending unless user is the creator
    if (community.type === 'private' && isRequest && community.creatorId !== userId) {
      // Check if already pending
      if (community.pendingMembers.some(m => m.userId === userId)) {
        return res.status(400).json({ message: 'Join request already pending' });
      }

      community.pendingMembers.push({ userId, name });
      await community.save();
      return res.json({ message: 'Join request sent' });
    }

    // For public communities or if user is creator, add directly
    community.members.push({ userId, name });
    await community.save();
    res.json(community);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// New endpoint for handling join requests
router.post('/:id/approve', async (req, res) => {
  try {
    const { userId } = req.body;
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if requester is an admin
    const isAdmin = community.admins.some(a => a.userId === req.body.adminId);
    if (!isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find pending member
    const pendingMember = community.pendingMembers.find(m => m.userId === userId);
    if (!pendingMember) {
      return res.status(404).json({ message: 'No pending request found' });
    }

    // Move from pending to members
    community.members.push({
      userId: pendingMember.userId,
      name: pendingMember.name
    });
    community.pendingMembers = community.pendingMembers.filter(m => m.userId !== userId);

    await community.save();
    res.json(community);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}); 