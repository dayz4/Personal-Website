
public class Move extends Routine implements Commons {
	private Bot bot;
	
	private int[] botX, botY;
	private int xPos, yPos;
	private int nx, ny;
	private int px, py;
	private int dir;
	
	public Move(Bot bot){
		super();
		
		botX = bot.getX();
		botY = bot.getY();
		
		//where is the bot going
		nx = bot.getNX();
		ny = bot.getNY();
		
		//where has the bot been?
	    px = xPos - OFFSETS[dir][0];
	    py = yPos - OFFSETS[dir][1];
	    
	    dir = bot.getDir();
	}
	
	@Override
	public void reset() {
		start();
	}

	@Override
	public void act(Bot bot, Board board) {
		if(isRunning()){
			System.out.println("move is running");
			if(bot.isCollided()){
				fail();
				return;
			}
			move(bot);
		}
	}
	
	private void move(Bot bot){
		System.out.println("move routine move");
		for(int k = bot.getLength(); k > 0; k--){
			bot.setX(botX[k-1], k);
			bot.setY(botY[k-1], k);
		}
		
		if (bot.left){
			bot.setX((xPos-SQUARE_SIZE), 0);
		}
		if(bot.right){
			bot.setX((xPos+SQUARE_SIZE), 0);
		}
		if(bot.up){
			bot.setY((yPos-SQUARE_SIZE), 0);
		}
		if(bot.down){
			bot.setY((yPos+SQUARE_SIZE), 0);
		}
	}
}
