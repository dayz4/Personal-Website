import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.net.URL;
import java.util.Random;

import javax.swing.ImageIcon;
import javax.swing.JPanel;
import javax.swing.Timer;


public class Board extends JPanel implements ActionListener, Commons{
	private Image square1, square2;
	private Image appleI;
	private Image head1, head2;
	
	private int appleX;
	private int appleY;
	
	private Timer timer;
	
	private boolean inGame = true;
	
	private Bot bot;
	private Player player;
	private Apple apple;
	
	public static int[][] grid;
    private Random r = new Random();
    public int dir, direction;
    public int xPos, yPos;
    public int nx, ny, px, py;

	public Board(){
		addKeyListener(new TAdapter());
		setBackground(Color.GRAY);
		setFocusable(true);
		
		setPreferredSize(new Dimension(BOARD_WIDTH, BOARD_HEIGHT));

		loadImages();
		initGame();
	}
	
	private void loadImages(){
		ImageIcon headIcon1 = new ImageIcon(getClass().getResource("/icons/head1.png"));
		head1 = headIcon1.getImage();
		
		ImageIcon squareIcon1 = new ImageIcon(getClass().getResource("/icons/square1.png"));
		square1 = squareIcon1.getImage();

		ImageIcon headIcon2 = new ImageIcon(getClass().getResource("/icons/head2.png"));
		head2 = headIcon2.getImage();
		
		ImageIcon squareIcon2 = new ImageIcon(getClass().getResource("/icons/square2.png"));
		square2 = squareIcon2.getImage();		
		
		ImageIcon appleIcon = new ImageIcon(getClass().getResource("/icons/apple.png"));
		appleI = appleIcon.getImage();
	}
	
	public void paintComponent(Graphics g){
		super.paintComponent(g);
		setDoubleBuffered(true);
		doDrawing(g);
	}
	
	private void doDrawing(Graphics g){
		if(inGame){
			System.out.println("drawing");
			g.drawImage(appleI, apple.getX(), apple.getY(), this);
		
			for(int k = 1; k<player.length; k++){
				g.drawImage(square1, player.getX()[k], player.getY()[k], this);
			}
			g.drawImage(head1, player.getX()[0], player.getY()[0], this);
			
			for(int k = 1; k<bot.getLength(); k++){
				g.drawImage(square2, bot.getX()[k], bot.getY()[k], this);
			}
			g.drawImage(head2, bot.getX()[0], bot.getY()[0], this);
			
			Toolkit.getDefaultToolkit().sync();
		}
		else gameOver(g);
	}
	
	private void initGame(){		
		bot = new Bot();
		player = new Player();
		
		dir = bot.getDir();
		
		locateApple();
		
		timer = new Timer(DELAY, this);
		timer.start();
	}
	

	private void checkApple(){
		int length1 = player.getLength();
		if(player.getX()[0] == apple.getX() && player.getY()[0] == apple.getY()){
			length1++;
			player.setLength(length1);
			locateApple();
		}

		int length2 = bot.getLength();
		if(bot.getX()[0] == apple.getX() && bot.getY()[0] == apple.getY()){
			length2++;
			bot.setLength(length2);
			locateApple();
		}
	}
	
	private void checkCollision(){
		player.checkCollision();
		bot.checkCollision();
		
		if(player.getCollided() || bot.getCollided()){
			inGame = false;
		}
		
		for(int i = player.getLength(); i>0; i--){
			for(int j = bot.getLength(); j>0; j--){
				if((player.getX()[0] == bot.getX()[j] && player.getY()[0] == bot.getY()[j]) || (bot.getX()[0] == player.getX()[i] && bot.getY()[0] == player.getY()[i])){
					inGame = false;
				}
			}
		}
		
		if(!inGame) timer.stop();
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
	
	private void move(){
		//bot moves
//		System.out.println("start moving");
//		bot.setRoutine(Routines.seek(apple, bot, player));
//
//		if(nCollide()){
//    		bot.setRoutine(Routines.turn(apple, bot, player));
//    	}
//		bot.findDirection();
//		bot.setRoutine(Routines.move(bot));
//		
//		//player moves
//		player.move();
//		System.out.println("end moving");
		
		for(int k = bot.getLength(); k > 0; k--){
			bot.getX()[k] = bot.getX()[k-1];
			bot.getY()[k] = bot.getY()[k-1];
		}
		
		xPos = bot.getXPos();
		yPos = bot.getYPos();
		
		//where is the bot going
    	nx = xPos + OFFSETS[dir][0];
        ny = yPos + OFFSETS[dir][1];
        //where has the bot been?
        px = xPos - OFFSETS[dir][0];
        py = yPos - OFFSETS[dir][1];
		
		think();
		bot.findDirection();
		
		if (bot.left){
			bot.setX((bot.getX()[0]-SQUARE_SIZE), 0);
		}
		if(bot.right){
			bot.setX((bot.getX()[0]+SQUARE_SIZE), 0);
		}
		if(bot.up){
			bot.setY((bot.getY()[0]-SQUARE_SIZE), 0);
		}
		if(bot.down){
			bot.setY((bot.getY()[0]+SQUARE_SIZE), 0);
		}
		player.move();
		System.out.println("done moving");
	}
	
	private void locateApple(){
		int ax = (int)(Math.random()*RANDOMIZE);
		int ay = (int)(Math.random()*RANDOMIZE);
		
		for (int i = 0; i<player.getLength(); i++){
			while (ax == player.getX(i) || ay == player.getY(i)){
				if (ax == player.getX(i)){
					ax = (int)(Math.random()*RANDOMIZE);
				}
				else{
					ay = (int)(Math.random()*RANDOMIZE);
				}
			}
		}
			
		for (int j = 0; j<bot.getLength(); j++){
			while (ay == player.getX(j) || ay == player.getY(j)){
				if (ay == player.getX(j)){
					ay = (int)(Math.random()*RANDOMIZE);
				}
				else{
					ay = (int)(Math.random()*RANDOMIZE);
				}
			}
		}
		
		apple = new Apple(ax*SQUARE_SIZE, ay*SQUARE_SIZE);
	}
	
	public void think(){
//		System.out.println("start thinking");
//		bot.setRoutine(Routines.seek(apple, bot, player));
//
//		if(nCollide()){    		
//    		bot.setRoutine(Routines.turn(apple, bot, player));
//    	}
//		System.out.println("end thinking");
		
		seek();
		if (nCollide()) {
			turn();
		}
		
    }
	
	public void seek(){
		//turn towards the apple
		if(xPos == apple.getX() || yPos == apple.getY()){
			turn();
		}
	}
	
    public void turn(){
       	//turn in the direction closest to the apple/turn towards the apple
    	direction = dir;
    	
       	if(apple.getX() > xPos && (dir == 1 || dir == 3)){
       		System.out.println("a");
       		direction = 0;
       	}
       	
       	else if(apple.getX() < xPos && (dir == 1 || dir == 3)){
       		System.out.println("b");
       		direction = 2;
       	}
       	
       	else if(apple.getY() > yPos && (dir == 0 || dir == 2)){
       		System.out.println("c");
       		direction = 3;
       	}
       	else if(apple.getY() < yPos && (dir == 0 || dir == 2)){
       		System.out.println("d");
       		direction = 1;
       	}
       	
       	else if((apple.getX() == xPos && (Math.abs(apple.getY() - ny)) > Math.abs((apple.getY() - yPos))) || apple.getY() == yPos && (Math.abs(apple.getX() - nx)) > (Math.abs(apple.getX() - xPos))){
       		System.out.println("e");
       		pick();
       	}
       	
       	else if((apple.getX() == xPos && (Math.abs(apple.getY() - ny)) < Math.abs((apple.getY() - yPos))) || apple.getY() == yPos && (Math.abs(apple.getX() - nx)) < (Math.abs(apple.getX() - xPos))){
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
        System.out.println("turned " + dir);
    }
    
    public void pick(){
    	//turn in the direction closest to a wall
    	System.out.println("picking");
    	int yd = yPos;
    	int ydCount = 0;
    	
       	int yu = yPos;
       	int yuCount = 0;
       	
       	int xr = xPos;
       	int xrCount = 0;
       	
       	int xl = xPos;
       	int xlCount = 0;
       	
       	while (yd < BOARD_HEIGHT){
       		yd++;
       		ydCount++;
       	}
       	while (yu > 0){
      		yu--;
      		yuCount++;
       	}
       	while (xr < BOARD_WIDTH){
       		xr++;
       		xrCount++;
       	}
       	while (xl > 0){
       		xl--;
       		xlCount++;
       	}
       	if ((dir == 0 && yuCount > ydCount) || (dir == 1 && xlCount > xrCount) || (dir == 2 && ydCount > yuCount) || (dir == 3 && xrCount > xlCount)){
       		System.out.println("def");
       		direction = (dir + 3) % 4;
       	}
       	else{
       		System.out.println("abc");
       		direction = (dir + 1) % 4;
      	}
    }
    
    public void oneWayRoad(){
    	//about to go through a one way road; change pattern
    	int nnx = nx + OFFSETS[dir][0];
    	int nny = ny + OFFSETS[dir][1];

    	if (grid[nnx][yPos] == 0 && (grid[nnx][yPos+1] != 0 && grid[nnx][yPos-1] != 0)){
    		//wall below; go up
    		//right
    		if (grid[xPos][yPos-1] == 0 && dir == 0){
    			dir = (dir + 1) % 4;
    		}
    		//left
    		else if (grid[xPos][yPos-1] == 0 && dir == 2){
    			dir = (dir + 3) % 4;
    		}
    		
    		//wall above; go down
    		//right 
    		if (grid[xPos][yPos+1] == 0 && dir == 0){
    			dir = (dir + 3) % 4;
    		}
    		//left
    		else if (grid[xPos][yPos+1] == 0 && dir == 2){
    			dir = (dir + 1) % 4;
    		}
    	}
    	
    	if (grid[xPos][nny] == 0 && (grid[xPos+1][nny] != 0 && grid[xPos-1][nny] != 0)){
    		//wall left; go right
    		//up
    		if (grid[xPos+1][yPos] == 0 && dir == 1){
    			dir = (dir + 3) % 4;
    		}
    		//down
    		else if (grid[xPos+1][yPos] == 0 && dir == 3){
    			dir = (dir + 1) % 4;
    		}
    		
    		//wall right; go left
    		//up 
    		if (grid[xPos-1][yPos] == 0 && dir == 1){
    			dir = (dir + 1) % 4;
    		}
    		//down
    		else if (grid[xPos-1][yPos] == 0 && dir == 3){
    			dir = (dir + 3) % 4;
    		}
    	}
    }
    
//    public void attack(){
//        //if the enemy is 3 behind (left) and 1 up/down, turn 3 times to cut it off
//        if (enemies[0][0] == x-3){
//        	System.out.println("here!");
//        	 if (enemies[0][1] == y-1){
//        		 dir = (dir + 1) % 4;
//        	 }
//        	 if (enemies[0][1] == y+1){
//        		 dir = (dir + 3) % 4;
//        	 }
//        }
//        if (enemies[0][0] == x+3){
//        	if (enemies[0][1] == y-1){
//        		dir = (dir + 1) % 4;
//        	}
//        	if (enemies[0][1] == y+1){
//        		dir = (dir + 3) % 4;
//        	}
//        }
//    }

	
	private void gameOver(Graphics g){
		String message = "Game Over";
		String message2 = "(press SPACE to restart)"; 
		Font font = new Font("Helvetica", Font.BOLD, 28);
		Font font2 = new Font("Helvetica", Font.BOLD, 16);
		FontMetrics metrics = getFontMetrics(font);
		FontMetrics metrics2 = getFontMetrics(font2);
		
		g.setColor(Color.WHITE);
		g.setFont(font);
		g.drawString(message, BOARD_WIDTH/2 - (metrics.stringWidth(message)/2), BOARD_HEIGHT/2 - (metrics.getAscent()/2));
		
		g.setFont(font2);
		g.drawString(message2, BOARD_WIDTH/2 - (metrics2.stringWidth(message2)/2), BOARD_HEIGHT/2 - (metrics2.getAscent()/2) + 25);
	}
	
	@Override
	public void actionPerformed(ActionEvent e) {
		if(inGame){
//			System.out.println("bot about to update");
//			bot.update();
//			System.out.println("bot updated");
			move();
			checkApple();
			checkCollision();
		}
		
		repaint();
	}
	
	private class TAdapter extends KeyAdapter{
		public void keyPressed(KeyEvent e){
			player.keyPressed(e);
			
			int key = e.getKeyCode();
			if (key == KeyEvent.VK_SPACE && !inGame){
				inGame = true;
				loadImages();
				initGame();
				new Board();
			}
		}
	}
}
