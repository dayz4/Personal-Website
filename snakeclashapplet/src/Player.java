import java.awt.event.KeyEvent;


public class Player extends Contestant{
	
	
	public Player() {
		x[0] = BOARD_WIDTH/2;
		y[0] = BOARD_HEIGHT - 10 - SQUARE_SIZE;
		
		up = true;
	}
	
	public void move(){
		for(int k = length; k > 0; k--){
			x[k] = x[k-1];
			y[k] = y[k-1];
		}
		
		if (left){
			x[0] -= SQUARE_SIZE;
		}
		if(right){
			x[0] += SQUARE_SIZE;
		}
		if(up){
			y[0] -= SQUARE_SIZE;
		}
		if(down){
			y[0] += SQUARE_SIZE;
		}
	}
	
	public void checkCollision(){
		if(x[0]<0 || x[0] > BOARD_WIDTH-SQUARE_SIZE || y[0]<0 || y[0] > BOARD_HEIGHT-SQUARE_SIZE){
			collided = true;
			return;
		}
		
		for(int k = length; k>0; k--){
			if(x[0] == x[k] && y[0] == y[k]){
				collided = true;
				break;
			}
		}
	}
	
	public void keyPressed(KeyEvent e){
		int key = e.getKeyCode();
		
		if(key == KeyEvent.VK_LEFT && !right){
			left = true;
			up = false;
			down = false;
		}
		if(key == KeyEvent.VK_RIGHT && !left){
			right = true;
			up = false;
			down = false;
		}
		if(key == KeyEvent.VK_UP && !down){
			up = true;
			left = false;
			right = false;
		}
		if(key == KeyEvent.VK_DOWN && !up){
			down = true;
			left = false;
			right = false;
		}
	}
}