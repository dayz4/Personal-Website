
public class Seek extends Routine implements Commons{

	final private int appleX, appleY;
	
	private int dir, direction;
	private int xPos, yPos;
	private int nx, ny;
	
	private Player player;
	
	public Seek(Apple apple, Bot bot, Player player){
		super();
		appleX = apple.getX();
		appleY = apple.getY();
		
		dir = bot.getDir();
		xPos = bot.getXPos();
		yPos = bot.getYPos();
		nx = bot.getNX();
		ny = bot.getNY();
		
		this.player = player;
	}
	
	@Override
	public void reset() {
		start();
	}

	@Override
	public void act(Bot bot, Board board) {
		System.out.println("seek act");
		if(isRunning()){
			System.out.println("bot is running");
			if(bot.isCollided()){
				fail();
				return;
			}
			if(!isBotAtDestination(bot)){
				seek(bot);
			} bot.getRoutine().reset();
		}
	}
	
	private void seek(Bot bot) {
		System.out.println("seeking now");
		direction = dir;
    	
       	if(appleX > xPos && (dir == 1 || dir == 3)){
       		System.out.println("a");
       		direction = 0;
       	}
       	
       	else if(appleX < xPos && (dir == 1 || dir == 3)){
       		System.out.println("b");
       		direction = 2;
       	}
       	
       	else if(appleY > yPos && (dir == 0 || dir == 2)){
       		System.out.println("c");
       		direction = 3;
       	}
       	else if(appleY < yPos && (dir == 0 || dir == 2)){
       		System.out.println("d");
       		direction = 1;
       	}
       	
       	else if((appleX == xPos && (Math.abs(appleY - ny)) > Math.abs((appleY - yPos))) || appleY == yPos && (Math.abs(appleX - nx)) > (Math.abs(appleX - xPos))){
       		System.out.println("e");
       		bot.pick();
       	}
       	
       	else if((appleX == xPos && (Math.abs(appleY - ny)) < Math.abs((appleY - yPos))) || appleY == yPos && (Math.abs(appleX - nx)) < (Math.abs(appleX - xPos))){
       		System.out.println("f");

       	}
       	
       	else{
       		System.out.println("g");
       		int r = (int)Math.random()*2;
       		if(dir == 0 || dir == 2){
       			if(r == 0) direction = 1;
       			if(r == 1) direction = 3;
       		}
       		if(dir == 1 || dir == 3){
       			if(r == 0) direction = 0;
       			if(r == 1) direction = 2;
       		}
       	}
       	
       	System.out.println("prelim " + direction);
        int cnt = 0;
        
        // check this new direction is safe -- if not, try others
        while (++cnt < 4) {
        	bot.setNext(direction);

        	nx = bot.getNX();
        	ny = bot.getNY();
        	
            if (nx>=0 && nx<=BOARD_WIDTH-SQUARE_SIZE && ny>=0 && ny <= BOARD_HEIGHT-SQUARE_SIZE && !nCollide()){
                break;
            }
            if(dir == direction || dir == (direction + 2) % 4){
            	direction = (direction + 1) % 4;
            }
            else if(dir == (direction + 1)%4 || dir == (direction + 3) % 4){
            	direction = (direction + 2) % 4;
            }
        }
        
        dir = direction;
        bot.setDir(direction);
        bot.setNext(dir);

		
		if(isBotAtDestination(bot)){
			succeed();
		}
	}
	
	private boolean nCollide(){
		boolean nCollide = false;
		for(int k = 0; k<player.getLength(); k++){
			System.out.println(dir);
			System.out.println(xPos + " " + nx + " " + player.getX()[k]);
			System.out.println(yPos + " " + ny + " " + player.getY()[k]);
			if(nx == player.getX()[k] && ny == player.getY()[k]){
				System.out.println("gonna crash");
				nCollide = true;
				break;
			}
		}
		
		//if about to collide on self, turn
//		for(int k = bot.getLength()-1; k>0; k--){
//			if(xPos == bot.getX()[k] && yPos == bot.getY()[k]){
//				nCollide = true;
//				break;
//			}
//		}
		
		if (nx<0 || nx > BOARD_WIDTH-SQUARE_SIZE || ny<0 || ny > BOARD_HEIGHT-SQUARE_SIZE){
			System.out.println("wall " + nx + " " + ny);
			nCollide = true;
		}
		return nCollide;
	}
	
	private boolean isBotAtDestination(Bot bot) {
		return bot.getX(0) == appleX && bot.getY(0) == appleY;
	}
}
